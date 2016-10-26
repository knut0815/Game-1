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
		this.next = new Point(0, 0);
		this.position = new Point(obj.x || 0, obj.y || 0);
		this.texture = null;
		this.frame = 0;
		this.frames = obj.frames || 0;
		this.frameIdx = 0;
		this.hasTexture = obj.url !== void 0;
		this.isMoving = false;
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
		if (this.isMoving) return void 0;
		x = -x;
		y = -y;
		if (x < 0) {
			this.frameIdx = 2;
		} else if (y < 0) {
			this.frameIdx = 1;
		} else if (x > 0) {
			this.frameIdx = 3;
		} else if (y > 0) {
			this.frameIdx = 0;
		}
		this.next.x = this.position.x + x;
		this.next.y = this.position.y + y;
		this.isMoving = true;
		this.frame = ++this.frame % this.frames;
		setTimeout(() => {
			this.isMoving = false;
		}, 60);
		setTimeout(() => {
			if (!this.isMoving) {
				this.frame = 0;
			}
		}, 120);
		if (!client.grid.entityCanMoveTo(this)) return void 0;
		this.position.x += x;
		this.position.y += y;
	}

}