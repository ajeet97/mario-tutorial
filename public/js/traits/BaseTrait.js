export default class BaseTrait {
	constructor(name) {
		this.name = name
		this.tasks = []
	}

	queue(task) {
		this.tasks.push(task)
	}

	finalize() {
		this.tasks.forEach(task => task())
		this.tasks.length = 0
	}

	collides(us, them) { }

	obstruct(entity, side) { }

	update(entity, camera, level) { }
}