/** @param {Set<import('./entities/BaseEntity').default>} entities */
export default function createEntityLayer(entities) {
	return function drawSpriteLayer(context, camera) {
		entities.forEach(entity => entity.draw(context, camera))
	}
}