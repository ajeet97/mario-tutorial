import { Matrix } from './math.js'
import { loadJSON } from './loaders.js'
import { createBackgroundLayer, createEntityLayer } from './layers.js'

import EntityFactory from './entities/EntityFactory.js'
import Compositor from './Compositor.js'
import SpriteSheet from './SpriteSheet.js'
import TileCollider from './TileCollider.js'
import EntityCollider from './EntityCollider.js'

function* expandSpan(i1, iLen, j1, jLen) {
	for (let i = i1; i < i1 + iLen; i++) {
		for (let j = j1; j < j1 + jLen; j++) {
			yield [i, j]
		}
	}
}

function expandRange(range) {
	if (range.length === 4) return expandSpan(...range)
	else if (range.length === 3) return expandSpan(...range, 1)
	else if (range.length === 2) return expandSpan(range[0], 1, range[1], 1)
	throw new Error('Invalid range')
}

function* expandRanges(ranges) {
	for (const range of ranges) {
		yield* expandRange(range)
	}
}

function* expandeTiles(tiles, patterns) {
	function* iterateTiles(tiles, offsetI, offsetJ) {
		for (const tile of tiles) {
			for (let [i, j] of expandRanges(tile.ranges)) {
				i = i + offsetI
				j = j + offsetJ

				if (tile.pattern) {
					yield* iterateTiles(patterns[tile.pattern].tiles, i, j)
				} else {
					yield { tile, i, j }
				}
			}
		}
	}
	yield* iterateTiles(tiles, 0, 0)
}

function createCollisionGrid(tiles, patterns) {
	const grid = new Matrix()
	for (const { tile, i, j } of expandeTiles(tiles, patterns)) {
		grid.set(i, j, { type: tile.type })
	}
	return grid
}

function createBackgroundGrid(tiles, patterns) {
	const grid = new Matrix()
	for (const { tile, i, j } of expandeTiles(tiles, patterns)) {
		grid.set(i, j, { name: tile.name })
	}
	return grid
}

export default class Level {
	constructor() {
		this.totalTime = 0

		this.comp = new Compositor()
		/** @type {Set<import('./entities/BaseEntity').default>} */
		this.entities = new Set()
	}

	async setup(levelSpec) {
		await Promise.all([
			this._setupCollision(levelSpec),
			this._setupBackgroundLayers(levelSpec),
			this._setupEntities(levelSpec),
		])
	}

	_setupCollision(levelSpec) {
		const mergedTiles = levelSpec
			.layers
			.reduce((merged, layer) => merged.concat(layer.tiles), [])
		const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns)

		this.tileCollider = new TileCollider(collisionGrid)
		this.entityCollider = new EntityCollider(this.entities)
	}

	_setupEntities(levelSpec) {
		levelSpec.entities.forEach(({ name, pos: [i, j] }) => {
			const entity = EntityFactory[name]()
			entity.pos.set(i, j)
			this.entities.add(entity)
		})
	}

	async _setupBackgroundLayers(levelSpec) {
		const backgroundSpriteSheet = await SpriteSheet.load(levelSpec.spriteSheet)
		levelSpec.layers.forEach((layer) => {
			const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns)
			this.comp.layers.push(createBackgroundLayer(this, backgroundGrid, backgroundSpriteSheet))
		})
	}

	static async load(name) {
		const levelSpec = await loadJSON(`./levels/${name}.json`)

		const level = new Level()
		await level.setup(levelSpec)

		level.comp.layers.push(createEntityLayer(level.entities))
		return level
	}

	update(deltaTime) {
		this.entities.forEach((entity) => {
			entity.update(deltaTime, this)
		})

		this.entities.forEach((entity) => {
			this.entityCollider.check(entity)
		})

		this.entities.forEach((entity) => {
			entity.finalize()
		})

		this.totalTime += deltaTime
	}
}