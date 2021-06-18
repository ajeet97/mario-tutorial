import TileResolver from './TileResolver.js'

export default class TileCollider {
	constructor(tileMatrix) {
		this.tiles = new TileResolver(tileMatrix)
	}

	checkX(entity) {
		if (!entity.vel.x) return

		const x = entity.vel.x > 0 ? entity.pos.x + entity.size.x : entity.pos.x
		const matches = this.tiles.searchByRange(
			x, x,
			entity.pos.y, entity.pos.y + entity.size.y,
		)
		matches.forEach((match) => {
			if (match.tile.name !== 'ground') return
	
			if (entity.vel.x > 0) {
				if (entity.pos.x + entity.size.x > match.x1) {
					entity.pos.x = match.x1 - entity.size.x
					entity.vel.x = 0
				}
			} else if (entity.vel.x < 0) {
				if (entity.pos.x < match.x2) {
					entity.pos.x = match.x2
					entity.vel.x = 0
				}
			}
		})
	}

	checkY(entity) {
		if (!entity.vel.y) return

		const y = entity.vel.y > 0 ? entity.pos.y + entity.size.y : entity.pos.y
		const matches = this.tiles.searchByRange(
			entity.pos.x, entity.pos.x + entity.size.x,
			y, y,
		)
		matches.forEach((match) => {
			if (match.tile.name !== 'ground') return
	
			if (entity.vel.y > 0) {
				if (entity.pos.y + entity.size.y > match.y1) {
					entity.pos.y = match.y1 - entity.size.y
					entity.vel.y = 0
				}
			} else if (entity.vel.y < 0) {
				if (entity.pos.y < match.y2) {
					entity.pos.y = match.y2
					entity.vel.y = 0
				}
			}
		})
	}

	test(entity) {
		this.checkX(entity)
		this.checkY(entity)
	}
}