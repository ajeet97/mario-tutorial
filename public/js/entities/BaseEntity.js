import { Vec2, BoundingBox } from '../math.js'

export const Sides = {
	TOP: Symbol('top'),
	BOTTOM: Symbol('bottom'),
	LEFT: Symbol('left'),
	RIGHT: Symbol('right'),
}

export default class BaseEntity {
	constructor() {
		this.vel = new Vec2(0, 0)

		this.pos = new Vec2(0, 0)
		this.size = new Vec2(0, 0)
		this.offset = new Vec2(0, 0)

		this.bounds = new BoundingBox(this.pos, this.size, this.offset)

		this.lifetime = 0

		/** @type {Array<import('../traits/BaseTrait').default>} */
		this.traits = []
	}

	addTrait(trait) {
		this.traits.push(trait)
		this[trait.name] = trait
	}

	obstruct(side, match) {
		this.traits.forEach((trait) => {
			trait.obstruct(this, side, match)
		})
	}

	update(deltaTime, level) {
		this.lifetime += deltaTime
		this.traits.forEach((trait) => {
			trait.update(this, deltaTime, level)
		})
	}

	collides(candidate) {
		this.traits.forEach((trait) => {
			trait.collides(this, candidate)
		})
	}

	finalize() {
		this.traits.forEach((trait) => {
			trait.finalize()
		})
	}

	draw(context, camera) { }
}