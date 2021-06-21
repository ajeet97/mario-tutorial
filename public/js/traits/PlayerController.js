import { Vec2 } from '../math.js'
import BaseTrait from './BaseTrait.js'

export default class PlayerController extends BaseTrait {
	constructor(player) {
		super('playerController')

		this.checkpoint = new Vec2(0, 0)
		this.player = player
		this.time = 300
	}

	update(entity, deltaTime, level) {
		if (!level.entities.has(this.player)) {
			this.player.killable.revive()
			this.player.pos.set(this.checkpoint.x, this.checkpoint.y)
			level.entities.add(this.player)
		} else if (this.time > 0) {
			this.time = Math.max(0, this.time - 2 * deltaTime)
		}
	}
}