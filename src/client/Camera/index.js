import {
	MIN_SCALE,
	MAX_SCALE
} from "../../cfg";

import {
	Point,
	saw,
	zoomScale,
	getRandomInt,
	linearDistance
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

		this.instance = instance;

		this.size = new Point(0, 0);
		this.center = new Point(0, 0);
		this.position = new Point(0, 0);
		this.position.z = 0;

		this.drag = new Point(0, 0);
		this.last = new Point(0, 0);

		this.scale = MIN_SCALE;

		this.follow = null;

    this.shaking = 0;
    this.shakingPower = 0;

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
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @return {Number}
	 */
	lookAt(a, b, c, d) {
    var angle = Math.atan2(d - b, c - a);
    if (angle < 0) angle = Math.PI * 2 + angle;
    return (angle);
	}

	/**
	 * @param {MapEntity} entity
	 * @return {Boolean}
	 */
	isInView(entity) {

	}

	/**
	 * @param {Number} power
	 * @param {Number} duration
	 */
	shake(power, duration) {
	  power = power || 12;
	  if (power > this.shakingPower || this.shaking <= 0) {
	    this.shakingPower = power;
	  }
	  this.shaking = Math.max(this.shaking, duration || 1.0);
	}

	/**
	 * @param {MapEntity} entity
	 */
	setFollow(entity) {
		this.follow = entity;
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
		// re-render, so it feels flawless
		this.instance.renderer.render();
		this.saveToLocalStorage();
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
		this.saveToLocalStorage();
	}

	saveToLocalStorage() {
		localStorage.setItem("dox::scale", this.scale);
		localStorage.setItem("dox::position", `${this.position.x},${this.position.y}`);
	}

	/**
	 * @param {Number} width
	 * @param {Number} height
	 */
	onResize(width, height) {
		this.size.x = width;
		this.size.y = height;
  	this.center.x = this.size.x / 2;
  	this.center.y = this.size.y / 2;
	}

  onUpdate() {

  	let delta = this.instance.renderer.delta;

    if (this.follow !== null) {

      let followX = this.follow.draw.x;
      let followY = this.follow.draw.y;
      let followW = this.follow.size.x;
      let followH = this.follow.size.y;

      let distance = linearDistance(this.position.x, this.position.y, followX, followY);

      let speed = Math.max(16, 4 * distance - 30);
      let angle = this.lookAt(this.position.x, this.position.y, followX, followY);

      this.position.x = -(followX + followW / 2) * this.scale + this.center.x;
      this.position.y = -(followY + followH / 2) * this.scale + this.center.y;

    }

  }

}