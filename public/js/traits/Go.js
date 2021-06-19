import BaseTrait from './BaseTrait.js'

export default class Go extends BaseTrait {
	constructor() {
		super('go')

		this.dir = 0
		this.acceleration = 400
		this.deceleration = 300
		this.dragFactor = 1 / 2000

		this.heading = 1
		this.distance = 0
	}

	update(entity, deltaTime) {
		const absX = Math.abs(entity.vel.x)

		if (this.dir !== 0) {
			entity.vel.x += this.acceleration * this.dir * deltaTime

			if (entity.jump && !entity.jump.falling) {
				this.heading = this.dir
			} else if (!entity.jump) {
				this.heading = this.dir
			}
		} else if (entity.vel.x !== 0) {
			const decel = Math.min(absX, this.deceleration * deltaTime)
			entity.vel.x += entity.vel.x > 0 ? -decel : decel
		} else {
			this.distance = 0
		}

		const drag = this.dragFactor * entity.vel.x * absX
		entity.vel.x -= drag

		this.distance += absX * deltaTime
	}
}