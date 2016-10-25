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
		this.id = obj.id || 0;
		this.size = new Point(obj.width || 0, obj.height || 0);
		this.position = new Point(obj.x || 0, obj.y || 0);
		this.texture = null;
		this.frame = 0;
		this.hasTexture = obj.url !== void 0;
		this.isLocal = obj.local || false;
		this.isCollidable = obj.collidable === void 0 ? true : obj.collidable;
		this.collisionBox = obj.collisionBox === void 0 ? [] : obj.collisionBox;
		// load texture if necessary
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
			this.frame = 2;
		} else if (y < 0) {
			this.frame = 1;
		} else if (x > 0) {
			this.frame = 3;
		} else if (y > 0) {
			this.frame = 0;
		}
		this.position.x += x;
		this.position.y += y;
	}

	onUpdate() {

	}

}