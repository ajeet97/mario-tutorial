export default class SpriteSheet {
	constructor(image, tileWidth, tileHeight) {
		this.image = image
		this.tileWidth = tileWidth
		this.tileHeight = tileHeight

		this.tiles = new Map()
	}

	define(name, x, y, width, height) {
		const buffer = document.createElement('canvas')
		buffer.width = width
		buffer.height = height
		buffer.getContext('2d').drawImage(this.image,
			x, y, width, height,
			0, 0, width, height
		)

		this.tiles.set(name, buffer)
	}

	defineTile(name, i, j) {
		this.define(name, i * this.tileWidth, j * this.tileHeight, this.tileWidth, this.tileHeight)
	}

	draw(name, context, x, y) {
		const buffer = this.tiles.get(name)
		context.drawImage(buffer, x, y)
	}

	drawTile(name, context, i, j) {
		this.draw(name, context, i * this.tileWidth, j * this.tileHeight)
	}
}