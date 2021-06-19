import { Matrix } from './math.js'
import { loadJSON, loadSpriteSheet } from './loaders.js'
import { createBackgroundLayer, createEntityLayer } from './layers.js'
import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'

function createTiles(level, backgrounds) {
	const setTiles = (background, [iStart, iLen, jStart, jLen]) => {
		for (let i = iStart; i < iStart + iLen; i++) {
			for (let j = jStart; j < jStart + jLen; j++) {
				level.tiles.set(i, j, {
					name: background.tile,
					type: background.type,
				})
			}
		}
	}

	backgrounds.forEach((background) => {
		background.ranges.forEach((range) => {
			if (range.length === 4) {
				setTiles(background, range)
			} else if (range.length === 3) {
				setTiles(background, [...range, 1])
			} else if (range.length === 2) {
				setTiles(background, [range[0], 1, range[1], 1])
			}
		})
	})
}

export default class Level {
	constructor() {
		this.gravity = 1500
		this.totalTime = 0

		this.comp = new Compositor()
		/** @type {Set<import('./entities/BaseEntity').default>} */
		this.entities = new Set()
		this.tiles = new Matrix()

		this.tileCollider = new TileCollider(this.tiles)
	}

	static async create(name) {
		const levelSpec = await loadJSON(`./levels/${name}.json`)
		const backgroundSpriteSheet = await loadSpriteSheet(levelSpec.spriteSheet)

		const level = new Level()

		createTiles(level, levelSpec.backgrounds)

		level.comp.layers.push(createBackgroundLayer(level, backgroundSpriteSheet))
		level.comp.layers.push(createEntityLayer(level.entities))

		return level
	}

	update(deltaTime) {
		this.entities.forEach((entity) => {
			entity.update(deltaTime)

			entity.pos.x += entity.vel.x * deltaTime
			this.tileCollider.checkX(entity)

			entity.pos.y += entity.vel.y * deltaTime
			this.tileCollider.checkY(entity)

			entity.vel.y += this.gravity * deltaTime
		})

		this.totalTime += deltaTime
	}
}