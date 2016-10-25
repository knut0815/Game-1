/**
 * @class
 */
export class Point {

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * @return {Point}
	 */
	clone() {
		return (
			new Point(this.x, this.y)
		);
	}

}

/**
 * @param {Number}
 * @param {Number}
 */
export function zoomScale(n) {
  return (
    n >= 0 ? n + 1 :
    n < 0 ? -(n) + 1 :
    n + 1
  );
}

/**
 * @param {Number} x
 * @param {Number} y
 * @param {MapEntity} entity
 * @return {Boolean}
 */
export function pointIntersectsEntity(x, y, entity) {
  return (
    x >= entity.position.x &&
    x < entity.position.x + entity.size.x &&
    y >= entity.position.y &&
    y < entity.position.y + entity.size.y
  );
}