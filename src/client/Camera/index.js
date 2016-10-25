import {
	MIN_SCALE,
	MAX_SCALE
} from "../../cfg";

import {
	Point,
	zoomScale
} from "../../Math";

/**
 * @class
 */
export default class Camera {

	/**
	 * @param {Client} instance
	 * @constructor
	 */
	constructor(instance) {

		this.position = new Point(0, 0);
		this.position.z = 0;

		this.drag = new Point(0, 0);
		this.last = new Point(0, 0);

		this.scale = MIN_SCALE;

		this.size = new Point(0, 0);

		this.instance = instance;

	}

	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Point}
	 */
	getGameRelativeOffset(x, y) {
		let xx = ((x - this.position.x) / this.scale);
		let yy = ((y - this.position.y) / this.scale);
		return (new Point(xx, yy));
	}

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	onClick(x, y) {
		let position = this.getGameRelativeOffset(x, y);
		this.last.x = position.x;
		this.last.y = position.y;
	}

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	onDrag(x, y) {
		this.position.x += x - this.drag.x;
		this.position.y += y - this.drag.y;
		this.drag.x = x;
		this.drag.y = y;
	}

	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 */
	onMove(x, y, z) {
		this.position.x += x;
		this.position.y += y;
		this.position.z += z;
	}

	/**
	 * @param {Number} n
	 */
	onScale(n) {
		if (this.scale + n <= MIN_SCALE) return void 0;
  	if (this.scale + n >= MAX_SCALE) return void 0;
  	let scale = this.scale;
		this.scale += n;
		this.position.x -= this.last.x * (zoomScale(this.scale) - zoomScale(scale));
		this.position.y -= this.last.y * (zoomScale(this.scale) - zoomScale(scale));
	}

	/**
	 * @param {Number} width
	 * @param {Number} height
	 */
	onResize(width, height) {
		this.size.x = width;
		this.size.y = height;
	}

}