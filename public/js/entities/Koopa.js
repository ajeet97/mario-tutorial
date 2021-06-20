import SpriteSheet from '../SpriteSheet.js'
import PendulumWalk from '../traits/PendulumWalk.js'

import BaseEntity from './BaseEntity.js'

export default class Koopa extends BaseEntity {
	/** @type {import('../SpriteSheet').default} */
	static spriteSheet = null

	constructor() {
		super()
		this.init()
	}

	init() {
		this.size.set(16, 16)
		this.offset.set(0, 8)

		this.walk = new PendulumWalk()
		this.traits.push(this.walk)

		this.walkAnim = Koopa.spriteSheet.animations.get('walk')
	}

	static async load() {
		this.spriteSheet = await SpriteSheet.load('koopa')
	}

	draw(context, camera) {
		Koopa.spriteSheet.draw(this.walkAnim(this.lifetime), context,
			this.pos.x - camera.pos.x,
			this.pos.y - camera.pos.y,
			this.vel.x < 0
		)
	}
}