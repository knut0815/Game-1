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
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} w1
 * @param {Number} h1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} w2
 * @param {Number} h2
 * @return {Boolean}
 */
export function rectanglesOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(
	  x1 + w1 - 1 < x2 ||
	  y1 + h1 - 1 < y2 ||
	  x1 > x2 + w2 - 1 ||
	  y1 > y2 + h2 - 1
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