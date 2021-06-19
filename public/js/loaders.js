import { createAnim } from './animation.js'

import SpriteSheet from './SpriteSheet.js'

export function loadJSON(url) {
	return fetch(url).then(r => r.json())
}


export function loadImage(url) {
	return new Promise((resolve) => {
		const image = new Image()
		image.addEventListener('load', () => {
			resolve(image)
		})
		image.src = url
	})
}

export async function loadSpriteSheet(name) {
	const spriteSpec = await loadJSON(`./sprites/${name}.json`)
	const image = await loadImage(spriteSpec.imageURL)

	const sprites = new SpriteSheet(image, spriteSpec.tileW, spriteSpec.tileH)

	if (spriteSpec.tiles) {
		spriteSpec.tiles.forEach((tileSpec) => {
			sprites.defineTile(tileSpec.name, ...tileSpec.index)
		})
	}

	if (spriteSpec.frames) {
		spriteSpec.frames.forEach((frameSpec) => {
			sprites.define(frameSpec.name, ...frameSpec.rect)
		})
	}

	if (spriteSpec.animations) {
		spriteSpec.animations.forEach((animSpec) => {
			sprites.defineAnim(
				animSpec.name,
				createAnim(animSpec.frames, animSpec.frameLen)
			)
		})
	}

	return sprites
}
