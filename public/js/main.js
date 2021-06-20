import { createCameraLayer, createCollisionLayer } from './layers.js'
// import { setupMouseControl } from './debug.js'

import EntityFactory from './entities/EntityFactory.js'

import Level from './Level.js'
import Timer from './Timer.js'
import Camera from './Camera.js'

const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')

canvas.width = 640
canvas.height = 640

async function main() {
	await EntityFactory.load()

	const level = await Level.load('1-1')
	const mario = EntityFactory.mario()
	const camera = new Camera()

	/** Things for debugging purpose only */
	// setupMouseControl(canvas, mario, camera)
	level.comp.layers.push(createCameraLayer(camera))
	level.comp.layers.push(createCollisionLayer(level))

	level.entities.add(mario)
	mario.pos.set(64, 0)

	const fps = 60
	const timer = new Timer(1 / fps)
	timer.update = function update(deltaTime) {
		level.update(deltaTime)
		if (mario.pos.x > 100) camera.pos.x = mario.pos.x - 100
		level.comp.draw(context, camera)
	}

	timer.start()
}

main()