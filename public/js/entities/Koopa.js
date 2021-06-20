import SpriteSheet from '../SpriteSheet.js'
import BaseTrait from '../traits/BaseTrait.js'
import Killable from '../traits/Killable.js'
import PendulumMove from '../traits/PendulumMove.js'
import Physics from '../traits/Physics.js'
import Solid from '../traits/Solid.js'

import BaseEntity from './BaseEntity.js'

const State = {
	WALKING: Symbol('walking'),
	HIDING: Symbol('hiding'),
	PANIC: Symbol('panic'),
}

class Behaviour extends BaseTrait {
	constructor() {
		super('behaviour')

		this.hideTime = 0
		this.hideDuration = 5
		this.walkSpeed = null
		this.panicSpeed = 300
		this.state = State.WALKING
	}

	collides(us, them) {
		if (us.killable.dead) return

		if (them.stomper) {
			if (them.vel.y > us.vel.y) {
				this.handleStomp(us, them)
			} else if (them.killable) {
				this.handleNudge(us, them)
			}
		}
	}

	handleNudge(us, them) {
		if (this.state === State.WALKING) {
			if (them.killable) them.killable.kill()
		} else if (this.state === State.PANIC) {
			const travelDir = Math.sign(us.vel.x)
			const impaceDir = Math.sign(us.pos.x - them.pos.x)
			if (travelDir !== 0 && travelDir !== impaceDir && them.killable) {
				them.killable.kill()
			}
		} else {
			this.panic(us, them)
		}
	}

	handleStomp(us, them) {
		if (this.state === State.WALKING || this.state === State.PANIC) {
			this.hide(us)
		} else {
			us.killable.kill()
			us.solid.obstructs = false
			us.vel.set(them.go.heading > 0 ? 100 : -100, -300)
		}
	}

	hide(us) {
		us.vel.x = 0
		us.pendulumMove.enabled = false
		if (this.walkSpeed === null) this.walkSpeed = us.pendulumMove.speed
		this.hideTime = 0
		this.state = State.HIDING
	}
	
	unhide(us) {
		us.pendulumMove.enabled = true
		this.state = State.WALKING
		us.pendulumMove.speed = this.walkSpeed
	}

	panic(us, them) {
		us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x)
		us.pendulumMove.enabled = true
		this.state = State.PANIC
	}

	update(us, deltaTime) {
		if (this.state === State.HIDING) {
			this.hideTime += deltaTime
			if (this.hideTime > this.hideDuration) {
				this.unhide(us)
			}
		}
	}
}

export default class Koopa extends BaseEntity {
	/** @type {import('../SpriteSheet').default} */
	static spriteSheet = null

	constructor() {
		super()
		this.init()
	}

	init() {
		this.size.set(16, 16)
		this.offset.set(0, 8)

		this.addTrait(new Physics())
		this.addTrait(new Solid())
		this.addTrait(new PendulumMove())
		this.addTrait(new Killable())
		this.addTrait(new Behaviour())

		this.walkAnim = Koopa.spriteSheet.animations.get('walk')
		this.wakeAnim = Koopa.spriteSheet.animations.get('wake')
	}

	static async load() {
		this.spriteSheet = await SpriteSheet.load('koopa')
	}

	_resolveFrame() {
		if (this.behaviour.state === State.HIDING) {
			if (this.behaviour.hideTime > 3) return this.wakeAnim(this.behaviour.hideTime)
			return 'hiding'
		}
		if (this.behaviour.state === State.PANIC) return 'hiding'
		return this.walkAnim(this.lifetime)
	}

	draw(context, camera) {
		Koopa.spriteSheet.draw(this._resolveFrame(), context,
			this.pos.x - camera.pos.x,
			this.pos.y - camera.pos.y,
			this.vel.x < 0
		)
	}
}