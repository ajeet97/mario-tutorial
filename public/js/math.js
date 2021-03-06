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

export class BoundingBox {
	/**
	 * @param {Vec2} pos 
	 * @param {Vec2} size 
	 * @param {Vec2} offset 
	 */
	constructor(pos, size, offset) {
		this.pos = pos;
		this.size = size;
		this.offset = offset;
	}

	/** @param {BoundingBox} box */
	overlaps(box) {
		return this.bottom > box.top
			&& this.top < box.bottom
			&& this.left < box.right
			&& this.right > box.left
	}

	get bottom() {
		return this.pos.y + this.size.y + this.offset.y;
	}

	set bottom(y) {
		this.pos.y = y - (this.size.y + this.offset.y);
	}

	get top() {
		return this.pos.y + this.offset.y;
	}

	set top(y) {
		this.pos.y = y - this.offset.y;
	}

	get left() {
		return this.pos.x + this.offset.x;
	}

	set left(x) {
		this.pos.x = x - this.offset.x;
	}

	get right() {
		return this.pos.x + this.size.x + this.offset.x;
	}

	set right(x) {
		this.pos.x = x - (this.size.x + this.offset.x);
	}
}