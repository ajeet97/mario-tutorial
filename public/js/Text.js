import { loadImage } from './loaders.js'
import SpriteSheet from './SpriteSheet.js'

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export default class Text {
	/** @type {import('./SpriteSheet').default} */
	static spriteSheet = null
	static size = 8

	static async load() {
		const image = await loadImage('./img/font.png')
		this.spriteSheet = new SpriteSheet(image)

		const rowLen = image.width
		for (const [index, char] of [...CHARS].entries()) {
			const x = index * this.size % rowLen
			const y = Math.floor(index * this.size / rowLen) * this.size
			this.spriteSheet.define(char, x, y, this.size, this.size)
		}
	}

	static print(str, context, x, y) {
		for (let i = 0; i < str.length; i += 1) {
			this.spriteSheet.draw(str[i], context, x + i * this.size, y)
		}
	}
}