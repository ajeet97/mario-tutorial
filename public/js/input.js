import Keyboard from './Keyboard.js'

export function setupKeyboard(entity) {
	const input = new Keyboard()
	
	input.addMapping(['Space', 'ArrowUp'], (keyState) => {
		if (keyState) entity.jump.start()
		else entity.jump.cancel()
	})
	
	input.addMapping('ArrowRight', (keyState) => {
		if (keyState) entity.go.dir = keyState
		else if (entity.go.dir > 0) entity.go.dir = 0
	})

	input.addMapping('ArrowLeft', (keyState) => {
		if (keyState) entity.go.dir = -keyState
		else if (entity.go.dir < 0) entity.go.dir = 0
	})
	return input
}