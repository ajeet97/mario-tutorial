import { Matrix } from './math.js'
import { loadJSON, loadSpriteSheet } from './loaders.js'
import { createBackgroundLayer, createEntityLayer } from './layers.js'
import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'

function expandRange(range) {
	if (range.length === 4) return range
	else if (range.length === 3) return [...range, 1]
	else if (range.length === 2) return [range[0], 1, range[1], 1]
	throw new Error('Invalid range')
}

function expandeTiles(tiles, patterns) {
	const expandedTiles = []
	function iterateTiles(tiles, offsetI, offsetJ) {
		tiles.forEach((tile) => {
			tile.ranges.forEach((range) => {
				const [iStart, iLen, jStart, jLen] = expandRange(range)
				const i1 = iStart + offsetI
				const j1 = jStart + offsetJ
				for (let i = i1; i < i1 + iLen; i++) {
					for (let j = j1; j < j1 + jLen; j++) {
						if (tile.pattern) {
							iterateTiles(patterns[tile.pattern].tiles, i, j)
						} else {
							expandedTiles.push({ tile, i, j })
						}
					}
				}
			})
		})
	}

	iterateTiles(tiles, 0, 0)
	return expandedTiles
}

function createCollisionGrid(tiles, patterns) {
	const grid = new Matrix()
	expandeTiles(tiles, patterns).forEach(({ tile, i, j }) => {
		grid.set(i, j, { type: tile.type })
	})
	return grid
}

function createBackgroundGrid(tiles, patterns) {
	const grid = new Matrix()
	expandeTiles(tiles, patterns).forEach(({ tile, i, j }) => {
		grid.set(i, j, { name: tile.name })
	})
	return grid
}

export default class Level {
	constructor(collisionGrid) {
		this.gravity = 1500
		this.totalTime = 0

		this.comp = new Compositor()
		/** @type {Set<import('./entities/BaseEntity').default>} */
		this.entities = new Set()

		this.tileCollider = new TileCollider(collisionGrid)
	}

	static async create(name) {
		const levelSpec = await loadJSON(`./levels/${name}.json`)
		const backgroundSpriteSheet = await loadSpriteSheet(levelSpec.spriteSheet)
		
		const mergedTiles = levelSpec.layers.reduce((merged, layer) => merged.concat(layer.tiles), [])
		const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns)
		const level = new Level(collisionGrid)

		levelSpec.layers.forEach((layer) => {
			const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns)
			level.comp.layers.push(createBackgroundLayer(level, backgroundGrid, backgroundSpriteSheet))
		})
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