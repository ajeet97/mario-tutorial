export class Matrix {
	constructor() {
		this.grid = []
	}

	set(i, j, value) {
		if (!this.grid[i]) this.grid[i] = []
		this.grid[i][j] = value
	}

	get(i, j) {
		if (!this.grid[i]) return undefined
		return this.grid[i][j]
	}

	forEach(callback) {
		this.grid.forEach((column, i) => {
			column.forEach((value, j) => {
				callback(value, i, j)
			})
		})
	}
}

export class Vec2 {
	/**
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	constructor(x, y) {
		this.set(x, y)
	}

	set(x, y) {
		this.x = x
		this.y = y
	}
}