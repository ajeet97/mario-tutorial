import Goomba from './Goomba.js'
import Koopa from './Koopa.js'
import Mario from './Mario.js'

const factory = {
	mario: () => new Mario(),
	goomba: () => new Goomba(),
	koopa: () => new Koopa(),

	async load() {
		await Promise.all([
			Mario.load(),
			Goomba.load(),
			Koopa.load()
		])
	}
}

export default factory
