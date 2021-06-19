import { createAnim } from '../animation.js'
import { loadSpriteSheet } from '../loaders.js'
import Keyboard from '../Keyboard.js'
import Go from '../traits/Go.js'
import Jump from '../traits/Jump.js'
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
	/** @param {import('../SpriteSheet').default} spriteSheet */
	constructor(spriteSheet) {
		super()

		this.spriteSheet = spriteSheet
		this.init()
	}

	init() {
		this.size.set(16, 16)

		this.go = new Go()
		this.jump = new Jump()

		this.traits.push(
			this.go,
			this.jump,
		)

		this.go.dragFactor = SLOW_DRAG
		this.runAnim = createAnim(['run-1', 'run-2', 'run-3'], 7)

		setupKeyboard(this)
	}

	static async create() {
		const spriteSheet = await loadSpriteSheet('mario')
		return new Mario(spriteSheet)
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
		this.spriteSheet.draw(this._resolveFrame(), context,
			this.pos.x - camera.pos.x,
			this.pos.y - camera.pos.y,
			this.go.heading < 0,
		)
	}
}