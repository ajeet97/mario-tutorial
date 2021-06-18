import { loadLevel } from './loaders.js'
import { createMario } from './entities.js'
import { setupKeyboard } from './input.js'
import Timer from './Timer.js'

const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')

async function main() {
	const [mario, level] = await Promise.all([
		createMario(),
		loadLevel('1-1'),
	])

	level.entities.add(mario)
	mario.pos.set(64, 64)

	const input = new setupKeyboard(mario)
	input.listen();

	// ['mousedown', 'mousemove'].forEach((eventName) => {
	// 	canvas.addEventListener(eventName, (event) => {
	// 		if (event.buttons === 1) {
	// 			mario.vel.set(0, 0)
	// 			mario.pos.set(event.offsetX, event.offsetY)
	// 		}
	// 	})
	// })

	const fps = 60
	const timer = new Timer(1 / fps)
	timer.update = function update(deltaTime) {
		level.update(deltaTime)
		level.comp.draw(context)
	}

	timer.start()
}

main()