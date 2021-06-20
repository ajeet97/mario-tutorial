import { Sides } from './entities/BaseEntity.js'
import TileResolver from './TileResolver.js'

export default class TileCollider {
	constructor(tileMatrix) {
		this.tiles = new TileResolver(tileMatrix)
	}

	/** @param {import('./entities/BaseEntity').default} entity */
	checkX(entity) {
		if (!entity.vel.x) return

		const x = entity.vel.x > 0 ? entity.bounds.right : entity.bounds.left
		const matches = this.tiles.searchByRange(
			x, x,
			entity.bounds.top, entity.bounds.bottom,
		)
		matches.forEach((match) => {
			if (match.tile.type !== 'ground') return

			if (entity.vel.x > 0) {
				if (entity.bounds.right > match.x1) {
					entity.obstruct(Sides.RIGHT, match)
				}
			} else if (entity.vel.x < 0) {
				if (entity.bounds.left < match.x2) {
					entity.obstruct(Sides.LEFT, match)
				}
			}
		})
	}

	/** @param {import('./entities/BaseEntity').BaseEntity} entity */
	checkY(entity) {
		if (!entity.vel.y) return

		const y = entity.vel.y > 0 ? entity.bounds.bottom : entity.bounds.top
		const matches = this.tiles.searchByRange(
			entity.bounds.left, entity.bounds.right,
			y, y,
		)
		matches.forEach((match) => {
			if (match.tile.type !== 'ground') return

			if (entity.vel.y > 0) {
				if (entity.bounds.bottom > match.y1) {
					entity.obstruct(Sides.BOTTOM, match)
				}
			} else if (entity.vel.y < 0) {
				if (entity.bounds.top < match.y2) {
					entity.obstruct(Sides.TOP, match)
				}
			}
		})
	}
}