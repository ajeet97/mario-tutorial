import { createBackgroundLayer, createCollisionLayer, createEntityLayer } from './layers.js'
import { loadBackgroundSprites } from './sprites.js'

import Level from './Level.js'

export function loadImage(url) {
	return new Promise((resolve) => {
		const image = new Image()
		image.addEventListener('load', () => {
			resolve(image)
		})
		image.src = url
	})
}

function createTiles(level, backgrounds) {
	backgrounds.forEach((background) => {
		background.ranges.forEach(([i1, i2, j1, j2]) => {
			for (let i = i1; i < i2; i++) {
				for (let j = j1; j < j2; j++) {
					level.tiles.set(i, j, {
						name: background.tile,
					})
				}
			}
		})
	})
}

export async function loadLevel(name) {
	const [levelSpec, backgroundSprites] = await Promise.all([
		fetch(`/levels/${name}.json`).then(r => r.json()),
		loadBackgroundSprites(),
	])

	const level = new Level()

	createTiles(level, levelSpec.backgrounds)

	level.comp.layers.push(createBackgroundLayer(level, backgroundSprites))
	level.comp.layers.push(createEntityLayer(level.entities))
	level.comp.layers.push(createCollisionLayer(level))

	return level
}