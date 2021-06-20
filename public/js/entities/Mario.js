import Solid from '../traits/Solid.js'
import Go from '../traits/Go.js'
import Jump from '../traits/Jump.js'
import Stomper from '../traits/Stomper.js'
import Killable from '../traits/Killable.js'
import Physics from '../traits/Physics.js'

import Keyboard from '../Keyboard.js'
import SpriteSheet from '../SpriteSheet.js'

import BaseEntity from './BaseEntity.js'

const FAST_DRAG = 1 / 5000
const SLOW_DRAG = 1 / 1600

function isBreak(vel, dir) {
	return (vel > 0 && dir < 0) || (vel < 0 && dir > 0)
}

/** @param {Mario} mario */
function setupKeyboard(mario) {
	const input = new Keyboard()

	input.addMapping('KeyK', (keyState) => {
		if (keyState) mario.jump.start()
		else mario.jump.cancel()
	})

	input.addMapping('KeyJ', (keyState) => {
		mario.turbo(keyState)
	})

	input.addMapping('KeyD', (keyState) => {
		mario.go.dir += keyState ? 1 : -1
		// if (keyState) entity.go.dir = keyState
		// else if (entity.go.dir > 0) entity.go.dir = 0
	})

	input.addMapping('KeyA', (keyState) => {
		mario.go.dir += keyState ? -1 : 1
		// if (keyState) entity.go.dir = -keyState
		// else if (entity.go.dir < 0) entity.go.dir = 0
	})

	input.listen()
}

export default class Mario extends BaseEntity {
	/** @type {import('../SpriteSheet').default} */
	static spriteSheet = null

	constructor() {
		super()
		this.init()
	}

	init() {
		this.size.set(14, 16)

		this.addTrait(new Physics())
		this.addTrait(new Solid())
		this.addTrait(new Go())
		this.addTrait(new Jump())
		this.addTrait(new Stomper())
		this.addTrait(new Killable(0))

		this.turbo(false)
		this.runAnim = Mario.spriteSheet.animations.get('run')

		setupKeyboard(this)
	}

	static async load() {
		this.spriteSheet = await SpriteSheet.load('mario')
	}

	turbo(turboOn) {
		this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG
	}

	_resolveFrame() {
		if (this.jump.falling) return 'jump'
		if (isBreak(this.vel.x, this.go.dir)) return 'break'
		if (this.go.distance > 0) {
			return this.runAnim(this.go.distance)
		}
		return 'idle'
	}

	draw(context, camera) {
		Mario.spriteSheet.draw(this._resolveFrame(), context,
			this.pos.x - camera.pos.x,
			this.pos.y - camera.pos.y,
			this.go.heading < 0,
		)
	}
}