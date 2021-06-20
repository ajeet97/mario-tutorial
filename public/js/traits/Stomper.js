import BaseTrait from './BaseTrait.js'

export default class Stomper extends BaseTrait {
	constructor() {
		super('stomper')

		this.bounceSpeed = 220
	}

	bounce(us, them) {
		us.bounds.bottom = them.bounds.top
		us.vel.y = -this.bounceSpeed
	}

	collides(us, them) {
		if (!them.killable) return
		if (them.killable.dead) return

		if (us.vel.y > them.vel.y) {
			this.bounce(us, them)
		}
	}
}