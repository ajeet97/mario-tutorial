import SpriteSheet from '../SpriteSheet.js'
import PendulumWalk from '../traits/PendulumWalk.js'

import BaseEntity from './BaseEntity.js'

export default class Goomba extends BaseEntity {
	/** @type {import('../SpriteSheet').default} */
	static spriteSheet = null

	constructor() {
		super()
		this.init()
	}

	init() {
		this.size.set(16, 16)

		this.walk = new PendulumWalk()
		this.traits.push(this.walk)

		this.walkAnim = Goomba.spriteSheet.animations.get('walk')
	}

	static async load() {
		this.spriteSheet = await SpriteSheet.load('goomba')
	}

	draw(context, camera) {
		Goomba.spriteSheet.draw(this.walkAnim(this.lifetime), context,
			this.pos.x - camera.pos.x,
			this.pos.y - camera.pos.y,
			this.vel.x < 0
		)
	}
}