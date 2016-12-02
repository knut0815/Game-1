import TextureEntity from "../TextureEntity";

import {
  lerp,
	Point,
  rectanglesOverlap
} from "../../math";

import {
  encodePacket,
  PID
} from "../../packet";

class Animation {

  constructor(obj) {
    this.kind = obj.kind;
    this.idx = 0.0;
    this.value = obj.value;
    this.entity = obj.entity;
    this.isFinished = false;
  }

  play() {
    switch (this.kind) {
      case "MOVE":
        this.playMove();
      break;
    };
  }

  playMove() {
    let entity = this.entity;
    let x = this.value.x;
    let y = this.value.y;
    let delta = client.renderer.delta;
    let velo = (delta * entity.velocity);
    if (x < 0) {
      entity.frameIdx = 2;
      entity.draw.x -= velo;
    } else if (y < 0) {
      entity.frameIdx = 1;
      entity.draw.y -= velo;
    } else if (x > 0) {
      entity.frameIdx = 3;
      entity.draw.x += velo;
    } else if (y > 0) {
      entity.frameIdx = 0;
      entity.draw.y += velo;
    }
    if (entity.next.x - entity.draw.x < .5) {
      entity.frame = 1;
    } else {
      entity.frame = 0;
    }
    if (
      entity.draw.x >= entity.next.x &&
      entity.draw.y >= entity.next.y
    ) {
      this.isFinished = true;
      if (!entity.moveKeyPressed) {
        entity.isMoving = false;
      } else {
        // smootly continue move animation
        // if move button is still pressed
        this.pushAnimation("MOVE", {
          x: x, y: y
        });
      }
      entity.frame = 0;
      entity.position.x = entity.draw.x << 0;
      entity.position.y = entity.draw.y << 0;
    }
  }

}

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
    this.next = new Point(0, 0);
		this.size = new Point(obj.width || 0, obj.height || 0);
		this.position = new Point(obj.x || 0, obj.y || 0);
    this.draw = new Point(this.position.x, this.position.y);
    this.animations = [];
		this.texture = null;
		this.frame = 0;
		this.frames = obj.frames || 0;
		this.frameIdx = 0;
    this.velocity = 8;
		this.hasTexture = obj.url !== void 0;
		this.isMoving = false;
		this.isLocal = obj.local || false;
		this.isCollidable = obj.collidable === void 0 ? true : obj.collidable;
		this.collisionBox = obj.collisionBox === void 0 ? [] : obj.collisionBox;
		// load texture if necessary
		if (this.hasTexture) {
			this.texture = new TextureEntity(obj.url, this.size);
		}
	}

  /**
   * @param {String} kind
   * @param {Object} obj
   */
  pushAnimation(kind, obj) {
    this.animations.push(new Animation({
      kind: kind,
      value: obj,
      entity: this
    }));
  }

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	onMove(x, y) {
		if (this.isMoving) return void 0;
		x = -x;
		y = -y;
		/*if (x < 0) {
			this.frameIdx = 2;
		} else if (y < 0) {
			this.frameIdx = 1;
		} else if (x > 0) {
			this.frameIdx = 3;
		} else if (y > 0) {
			this.frameIdx = 0;
		}*/
    this.next.x = this.position.x + x;
    this.next.y = this.position.y + y;
    if (this.isLocal) this.sendMove(x, y);
    if (!this.canMove() || this.isMoving) return void 0;
    this.isMoving = true;
    this.pushAnimation("MOVE", {
      x: x, y: y
    });
		/*this.next.x = this.position.x + x;
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
    if (this.isLocal) this.sendMove(x, y);
		if (!this.canMove()) return void 0;
		this.position.x += x;
		this.position.y += y;
    this.draw.x = this.position.x;
    this.draw.y = this.position.y;*/
	}

  sendMove(x, y) {
    if (x < 0) {
      client.network.send(encodePacket([PID.MOVE, 37]));
    } else if (y < 0) {
      client.network.send(encodePacket([PID.MOVE, 38]));
    } else if (x > 0) {
      client.network.send(encodePacket([PID.MOVE, 39]));
    } else if (y > 0) {
      client.network.send(encodePacket([PID.MOVE, 40]));
    }
  }

  /**
   * @return {Boolean}
   */
  canMove() {
    if (this.isCollidable === false) return (true);
    let ii = 0;
    let length = client.entities.length;
    let entity = null;
    for (; ii < length; ++ii) {
      entity = client.entities[ii];
      // dont compare with ingoing entity
      if (this.id === entity.id) continue;
      if (entity.isCollidable === false) continue;
      if (rectanglesOverlap(
	      this.next.x, this.next.y,
	      this.size.x, this.size.y,
	      entity.position.x, entity.position.y,
	      entity.size.x, entity.size.y
	    ) === true) return (this.intersectCollisionBoxes(entity));
    };
    return (true);
  }

  /**
   * @param {MapEntity} entity
   * @return {Boolean}
   */
  intersectCollisionBoxes(entity) {

    let boxA = this.collisionBox;
    let boxB = entity.collisionBox;

    let x1 = this.next.x;
    let y1 = this.next.y;
    let w1 = this.size.x;
    let h1 = this.size.y;

    let x2 = entity.position.x;
    let y2 = entity.position.y;
    let w2 = entity.size.x;
    let h2 = entity.size.y;

    let dx = Math.max(x1, x2);
    let dw = Math.min(x1 + w1, x2 + w2);

    let dy = Math.max(y1, y2);
    let dh = Math.min(y1 + h1, y2 + h2);

    for (let yy = dy; yy < dh; ++yy) {
      for (let xx = dx; xx < dw; ++xx) {
        let bxa = boxA[(xx - x1) + (yy - y1) * w1];
        let bxb = boxB[(xx - x2) + (yy - y2) * w2];
        if (bxa === 1 && bxb === 1) return (false);
      };
    };

    return (true);

  }

}