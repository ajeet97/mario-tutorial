import BaseTrait from './BaseTrait.js'

export default class Killable extends BaseTrait {
	constructor(removeAfter = 2) {
		super('killable')

		this.dead = false
		this.deadTime = 0
		this.removeAfter = removeAfter
	}

	kill() {
		this.queue(() => {
			this.dead = true
		})
	}

	revive() {
		this.dead = false
		this.deadTime = 0
	}

	update(entity, deltaTime, level) {
		if (this.dead) {
			this.deadTime += deltaTime
			if (this.deadTime > this.removeAfter) {
				this.queue(() => {
					level.entities.delete(entity)
				})
			}
		}
	}
}