import { Sides } from '../entities/BaseEntity.js'
import BaseTrait from './BaseTrait.js'

export default class PendulumWalk extends BaseTrait {
	constructor() {
		super('pendulumWalk')

		this.speed = -30
	}

	obstruct(entity, side) {
		if (side === Sides.LEFT || side === Sides.RIGHT) {
			this.speed = -this.speed
		}
	}

	update(entity) {
		entity.vel.x = this.speed
	}
}