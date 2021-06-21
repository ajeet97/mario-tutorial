import TileResolver from '../TileResolver.js'

/**
 * @param {import('./Level').default} level 
 * @param {import('./math').Matrix} tiles
 * @param {import('./SpriteSheet').default} spriteSheet 
 */
export default function createBackgroundLayer(level, tiles, spriteSheet) {
	const tileResolver = new TileResolver(tiles)

	const buffer = document.createElement('canvas')
	buffer.width = 256 + 16
	buffer.height = 240

	const bufferCtx = buffer.getContext('2d')

	function redraw(drawFrom, drawTo) {
		bufferCtx.clearRect(0, 0, buffer.width, buffer.height)
		for (let i = drawFrom; i <= drawTo; i++) {
			const col = tiles.grid[i]
			if (col) {
				col.forEach((tile, j) => {
					if (spriteSheet.animations.has(tile.name)) {
						spriteSheet.drawAnim(tile.name, bufferCtx, i - drawFrom, j, level.totalTime)
					} else {
						spriteSheet.drawTile(tile.name, bufferCtx, i - drawFrom, j)
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