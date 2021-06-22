export default class BaseTrait {
	constructor(name) {
		this.name = name
		this.sounds = new Set()
		this.tasks = []
	}

	queue(task) {
		this.tasks.push(task)
	}

	finalize() {
		this.tasks.forEach(task => task())
		this.tasks.length = 0
	}

	playAudio(audio) {
		if (audio) this.sounds.forEach(name => audio.play(name))
		this.sounds.clear()
	}

	collides(us, them) { }

	obstruct(entity, side) { }

	update(entity, camera, level) { }
}