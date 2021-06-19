import { Vec2 } from '../math.js'

export const Sides = {
	TOP: Symbol('top'),
	BOTTOM: Symbol('bottom')
}

export class Trait {
	constructor(name) {
		this.name = name
	}

	obstruct() { }

	update() {
		console.warn('Unhandled update call in Trait')
	}
}

export default class Entity {
	constructor() {
		this.pos = new Vec2(0, 0)
		this.vel = new Vec2(0, 0)
		this.size = new Vec2(0, 0)

		this.traits = []
	}

	// addTrait(trait) {
	// 	this.traits.push(trait)
	// 	this[trait.name] = trait
	// }

	obstruct(side) {
		this.traits.forEach((trait) => {
			trait.obstruct(this, side)
		})
	}

	update(deltaTime) {
		this.traits.forEach((trait) => {
			trait.update(this, deltaTime)
		})
	}

	draw() {
		console.warn('Unhandled draw method for Entity:', this.constructor.name)
	}
}