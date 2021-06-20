import TileResolver from './TileResolver.js'

/**
 * @param {import('./Level').default} level 
 * @param {import('./math').Matrix} tiles
 * @param {import('./SpriteSheet').default} spriteSheet 
 */
export function createBackgroundLayer(level, tiles, spriteSheet) {
	const tileResolver = new TileResolver(tiles)

	const buffer = document.createElement('canvas')
	buffer.width = 256 + 16
	buffer.height = 240

	const bufferCtx = buffer.getContext('2d')

	let i1, i2
	function redraw(drawFrom, drawTo) {
		bufferCtx.clearRect(0, 0, buffer.width, buffer.height)
		// if (drawFrom === i1 && drawTo === i2) return
		i1 = drawFrom
		i2 = drawTo
		for (let i = i1; i <= i2; i++) {
			const col = tiles.grid[i]
			if (col) {
				col.forEach((tile, j) => {
					if (spriteSheet.animations.has(tile.name)) {
						spriteSheet.drawAnim(tile.name, bufferCtx, i - i1, j, level.totalTime)
					} else {
						spriteSheet.drawTile(tile.name, bufferCtx, i - i1, j)
					}
				})
			}
		}
	}

	return function drawBackgroundLayer(context, camera) {
		const drawWidth = tileResolver.toIndex(camera.size.x)
		const drawFrom = tileResolver.toIndex(camera.pos.x)
		redraw(drawFrom, drawFrom + drawWidth)
		context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y)
	}
}

/** @param {Set<import('./entities/BaseEntity').default>} entities */
export function createEntityLayer(entities) {
	return function drawSpriteLayer(context, camera) {
		entities.forEach(entity => entity.draw(context, camera))
	}
}

export function createCollisionLayer(level) {
	const resolvedTiles = []

	const tileResolver = level.tileCollider.tiles
	const tileSize = tileResolver.tileSize

	const getByIndexOriginal = tileResolver.getByIndex
	tileResolver.getByIndex = function getByIndexFake(i, j) {
		resolvedTiles.push([i, j])
		return getByIndexOriginal.call(tileResolver, i, j)
	}

	return function drawCollision(context, camera) {
		context.strokeStyle = 'blue'
		resolvedTiles.forEach(([i, j]) => {
			context.beginPath()
			context.rect(
				i * tileSize - camera.pos.x,
				j * tileSize - camera.pos.y,
				tileSize,
				tileSize
			)
			context.stroke()
		})

		context.strokeStyle = 'red'
		level.entities.forEach((entity) => {
			context.beginPath()
			context.rect(
				entity.bounds.left - camera.pos.x,
				entity.bounds.top - camera.pos.y,
				entity.size.x,
				entity.size.y
			)
			context.stroke()
		})
		resolvedTiles.length = 0
	}
}

export function createCameraLayer(cameraToDraw) {
	return function drawCameraRect(context, fromCamera) {
		context.strokeStyle = 'purple'
		context.beginPath()
		context.rect(
			cameraToDraw.pos.x - fromCamera.pos.x,
			cameraToDraw.pos.y - fromCamera.pos.y,
			cameraToDraw.size.x,
			cameraToDraw.size.y
		)
		context.stroke()
	}
}