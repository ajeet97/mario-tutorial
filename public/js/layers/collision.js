export default function createCollisionLayer(level) {
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