import BaseTrait from './BaseTrait.js'

export default class Physics extends BaseTrait {
	constructor() {
		super('physics')

		this.gravity = 1500
	}

	update(entity, deltaTime, level) {
		entity.pos.x += entity.vel.x * deltaTime
		level.tileCollider.checkX(entity)

		entity.pos.y += entity.vel.y * deltaTime
		level.tileCollider.checkY(entity)

		entity.vel.y += this.gravity * deltaTime
	}
}