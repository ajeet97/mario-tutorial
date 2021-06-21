// import createCameraLayer from './layers/camera.js'
// import createCollisionLayer from './layers/collision.js'
// import { setupMouseControl } from './debug.js'

import createDashboardLayer from './layers/dashboard.js'

import EntityFactory from './entities/EntityFactory.js'
import BaseEntity from './entities/BaseEntity.js'
import PlayerController from './traits/PlayerController.js'

import Level from './Level.js'
import Timer from './Timer.js'
import Camera from './Camera.js'
import Text from './Text.js'

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
	await Promise.all([
		EntityFactory.load(),
		Text.load(),
	])

	const level = await Level.load('1-1')
	const mario = EntityFactory.mario()
	const playerEnv = createPlayerEnv(mario)
	const camera = new Camera()

	level.entities.add(playerEnv)
	// level.entities.add(mario)
	
	level.comp.layers.push(createDashboardLayer(playerEnv))

	/** Things for debugging purpose only */
	// setupMouseControl(canvas, mario, camera)
	// level.comp.layers.push(createCameraLayer(camera))
	// level.comp.layers.push(createCollisionLayer(level))

	const frameLength = 1 / 60 // Frame length in time
	const timer = new Timer(frameLength)
	timer.update = function update(deltaTime) {
		level.update(deltaTime)
		camera.pos.x = Math.max(0, mario.pos.x - 100)
		level.comp.draw(context, camera)
	}

	timer.start()
}

main()