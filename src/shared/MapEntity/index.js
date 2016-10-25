import TextureEntity from "../TextureEntity";

import {
	Point
} from "../../math";

/**
 * @class
 */
export default class MapEntity {

	/**
	 * @param {Object} obj
	 * @constructor
	 */
	constructor(obj) {
		this.position = new Point(obj.x || 0, obj.y || 0);
		this.width = obj.width;
		this.height = obj.height;
		this.texture = null;
		this.frame = 0;
		this.hasTexture = obj.url !== void 0;
		if (this.hasTexture) {
			this.texture = new TextureEntity(obj.url);
		}
	}

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	onMove(x, y) {
		x = -x;
		y = -y;
		if (x < 0) {
			console.log("left");
			this.frame = 2;
		} else if (y < 0) {
			this.frame = 1;
			console.log("up");
		} else if (x > 0) {
			console.log("right");
			this.frame = 3;
		} else if (y > 0) {
			this.frame = 0;
			console.log("down");
		}
		this.x += x;
		this.y += y;
	}

}