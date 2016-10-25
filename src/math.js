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
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} width
 * @param {Number} height
 * @return {Boolean}
 */
export function pointIntersectsRectangle(x1, y1, x2, y2, width, height) {
  return (
    x1 >= x2 &&
    x1 < x2 + width &&
    y1 >= y2 &&
    y1 < y2 + height
  );
}