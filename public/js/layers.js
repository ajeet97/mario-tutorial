export function createBackgroundLayer(level, sprites) {
	const buffer = document.createElement('canvas')
	buffer.width = 240
	buffer.height = 240

	const bufferCtx = buffer.getContext('2d')

	level.tiles.forEach((tile, i, j) => {
		sprites.drawTile(tile.name, bufferCtx, i, j)
	})

	return function drawBackgroundLayer(context) {
		context.drawImage(buffer, 0, 0)
	}
}

export function createEntityLayer(entities) {
	return function drawSpriteLayer(context) {
		entities.forEach(entity => entity.draw(context))
	}
}

export function createCollisionLayer(level) {
	const resolvedTiles = []

	const tileResolver = level.tileCollider.tiles
	const tileSize = tileResolver.tileSize

	const getByIndexOriginal = tileResolver.getByIndex
	tileResolver.getByIndex = function getByIndexFake(i, j) {
		resolvedTiles.push([ i, j ])
		return getByIndexOriginal.call(tileResolver, i, j)
	}

	return function drawCollision(context) {
		context.strokeStyle = 'blue'
		resolvedTiles.forEach(([i, j]) => {
			context.beginPath()
			context.rect(i * tileSize, j * tileSize, tileSize, tileSize)
			context.stroke()
		})

		context.strokeStyle = 'red'
		level.entities.forEach((entity) => {
			context.beginPath()
			context.rect(entity.pos.x, entity.pos.y, entity.size.x, entity.size.y)
			context.stroke()
		})
		resolvedTiles.length = 0
	}
}