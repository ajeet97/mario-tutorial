import { loadJSON, loadImage } from './loaders.js'
import { createAnim } from './animation.js'
export default class SpriteSheet {
	constructor(image, tileW, tileH) {
		this.image = image
		this.tileW = tileW
		this.tileH = tileH

		this.tiles = new Map()
		this.animations = new Map()
	}

	static async load(name) {
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

	define(name, x, y, width, height) {
		const createBuffer = (mirrored) => {
			const buffer = document.createElement('canvas')
			buffer.width = width
			buffer.height = height
			const ctx = buffer.getContext('2d')
			if (mirrored) {
				ctx.scale(-1, 1)
				ctx.translate(-width, 0)
			}
			ctx.drawImage(this.image,
				x, y, width, height,
				0, 0, width, height
			)
			return buffer
		}

		this.tiles.set(name, [
			createBuffer(false),
			createBuffer(true),
		])
	}

	defineTile(name, i, j) {
		this.define(name, i * this.tileW, j * this.tileH, this.tileW, this.tileH)
	}

	defineAnim(name, animation) {
		this.animations.set(name, animation)
	}

	draw(name, context, x, y, mirrored = false) {
		const buffer = this.tiles.get(name)[mirrored ? 1 : 0]
		context.drawImage(buffer, x, y)
	}

	drawTile(name, context, i, j) {
		this.draw(name, context, i * this.tileW, j * this.tileH)
	}

	drawAnim(name, context, i, j, distance) {
		const anim = this.animations.get(name)
		this.draw(anim(distance), context, i * this.tileW, j * this.tileH)
	}
}