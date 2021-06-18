export default class Timer {
	constructor(deltaTime = 1/60) {
		let accumulatedTime = 0
		let lastTime = 0
		this.updateProxy = (time) => {
			accumulatedTime += (time - lastTime) / 1000
			lastTime = time

			// Draw all accumulated frames in case of slower frame rate
			while(accumulatedTime > deltaTime) {
				this.update(deltaTime)
				accumulatedTime -= deltaTime
			}

			this.enqueue()
		}
	}

	enqueue() {
		requestAnimationFrame(this.updateProxy)
	}

	start() {
		this.enqueue()
	}
}