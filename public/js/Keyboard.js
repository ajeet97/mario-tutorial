const PRESSED = 1
const RELEASED = 0

export default class Keyboard {
	constructor() {
		this.keyStates = new Map();
		this.keyMap = new Map();
	}

	addMapping(codes, callback) {
		if (!Array.isArray(codes)) codes = [codes]
		codes.forEach((code) => {
			this.keyMap.set(code, callback)
		})
	}

	handleEvent(event) {
		const { code } = event
		if (!this.keyMap.has(code)) return
		event.preventDefault()

		const keyState = event.type === 'keydown' ? PRESSED : RELEASED
		if (this.keyStates.get(code) === keyState) return
		
		this.keyStates.set(code, keyState)
		this.keyMap.get(code)(keyState)
	}

	listen() {
		['keydown', 'keyup'].forEach((eventName) => {
			window.addEventListener(eventName, event => this.handleEvent(event))
		})
	}
}