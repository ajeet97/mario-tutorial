export default class TileResolver {
	constructor(matrix, tileSize = 16) {
		this.matrix = matrix
		this.tileSize = tileSize
	}

	toIndex(pos) {
		return Math.floor(pos / this.tileSize)
	}

	toIndexRange(pos1, pos2) {
		const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize
		const range = []
		let pos = pos1
		do {
			range.push(this.toIndex(pos))
			pos += this.tileSize
		} while(pos < pMax)
		return range
	}

	getByIndex(i, j) {
		const tile = this.matrix.get(i, j)
		if (!tile) return null
		return {
			tile,
			x1: i * this.tileSize,
			x2: (i + 1) * this.tileSize,
			y1: j * this.tileSize,
			y2: (j + 1) * this.tileSize,
		}
	}

	searchByPosition(x, y) {
		return this.getByIndex(this.toIndex(x), this.toIndex(y))
	}

	searchByRange(x1, x2, y1, y2) {
		const matches = []
		this.toIndexRange(x1, x2).forEach((i) => {
			this.toIndexRange(y1, y2).forEach((j) => {
				const match = this.getByIndex(i, j)
				if (match) matches.push(match)
			})
		})
		return matches
	}
}