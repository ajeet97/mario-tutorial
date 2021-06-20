import SpriteSheet from '../SpriteSheet.js'
import BaseTrait from '../traits/BaseTrait.js'
import Killable from '../traits/Killable.js'
import PendulumMove from '../traits/PendulumMove.js'
import Physics from '../traits/Physics.js'
import Solid from '../traits/Solid.js'

import BaseEntity from './BaseEntity.js'

class Behaviour extends BaseTrait {
	constructor() {
		super('behaviour')
	}

	collides(us, them) {
		if (us.killable.dead) return

		if (them.stomper) {
			if (them.vel.y > us.vel.y) {
				us.killable.kill()
				us.vel.x = 0
				us.pendulumMove.enabled = false
			} else if (them.killable) {
				them.killable.kill()
			}
		}
	}
}

export default class Goomba extends BaseEntity {
	/** @type {import('../SpriteSheet').default} */
	static spriteSheet = null

	constructor() {
		super()
		this.init()
	}

	init() {
		this.size.set(16, 16)

		this.addTrait(new Physics())
		this.addTrait(new Solid())
		this.addTrait(new PendulumMove())
		this.addTrait(new Killable())
		this.addTrait(new Behaviour())

		this.walkAnim = Goomba.spriteSheet.animations.get('walk')
	}

	static async load() {
		this.spriteSheet = await SpriteSheet.load('goomba')
	}

	_resolveFrame() {
		if (this.killable.dead) return 'flat'
		return this.walkAnim(this.lifetime)
	}

	draw(context, camera) {
		Goomba.spriteSheet.draw(this._resolveFrame(), context,
			this.pos.x - camera.pos.x,
			this.pos.y - camera.pos.y,
			this.vel.x < 0
		)
	}
}