// import { createCameraLayer, createCollisionLayer } from './layers.js'
// import { setupMouseControl } from './debug.js'

import EntityFactory from './entities/EntityFactory.js'
import BaseEntity from './entities/BaseEntity.js'

import Level from './Level.js'
import Timer from './Timer.js'
import Camera from './Camera.js'
import PlayerController from './traits/PlayerController.js'

const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')

canvas.width = 256
canvas.height = 240

function createPlayerEnv(player) {
	const env = new BaseEntity()
	env.addTrait(new PlayerController(player))
	env.playerController.checkpoint.x = 64
	return env
}

async function main() {
	await EntityFactory.load()

	const level = await Level.load('1-1')
	const mario = EntityFactory.mario()
	const camera = new Camera()

	level.entities.add(createPlayerEnv(mario))
	// level.entities.add(mario)

	/** Things for debugging purpose only */
	// setupMouseControl(canvas, mario, camera)
	// level.comp.layers.push(createCameraLayer(camera))
	// level.comp.layers.push(createCollisionLayer(level))

	const fps = 60
	const timer = new Timer(1 / fps)
	timer.update = function update(deltaTime) {
		level.update(deltaTime)
		camera.pos.x = Math.max(0, mario.pos.x - 100)
		level.comp.draw(context, camera)
	}

	timer.start()
}

main()