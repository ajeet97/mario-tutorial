export default class EntityCollider {
	/**
	 * @param {Set<import('./entities/BaseEntity').default>} entities 
	 */
	constructor(entities) {
		this.entities = entities
	}

	/**
	 * @param {import('./entities/BaseEntity').default} subject 
	 */
	check(subject) {
		this.entities.forEach((candidate) => {
			if (subject === candidate) return

			if (subject.bounds.overlaps(candidate.bounds)) {
				subject.collides(candidate)
				candidate.collides(subject)
			}
		});
	}
}
