export default class BaseTrait {
	constructor(name) {
		this.name = name
	}

	obstruct() { }

	update() {
		console.warn('Unhandled update call in Trait')
	}
}