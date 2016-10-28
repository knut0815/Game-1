import {
  encodePacket,
  decodePacket,
  isValidPacket,
  PID, TYPE, PACKET
} from "../../packet";

import {
  getUniqueHash,
  getWGLRenderingContext
} from "../../utils";

import {
  DEV_MODE
} from "../../cfg";

/**
 * @class
 */
export default class Renderer {

  /**
   * @constructor
   * @param {Client} instance
   */
  constructor(instance) {

    this.grid = instance.grid;
    this.camera = instance.camera;
    this.entities = instance.entities;
    this.instance = instance;

    this.node = instance.node;
    this.ctx = this.node.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    window.addEventListener("resize", this::this.onResize);

    this.init();

  }

  init() {
    this.onResize();
    this.draw();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.camera.size.x, this.camera.size.y);
  }

  draw() {
    this.sort();
    this.clear();
    this.drawGrid();
    this.drawMap();
    this.drawEntities();
    this.drawMousePosition();
    window.requestAnimationFrame(() => this.draw());
  }

  drawMousePosition() {
    let x = this.instance.mousePosition.x;
    let y = this.instance.mousePosition.y;
    let ctx = this.ctx;
    let relative = this.camera.getGameRelativeOffset(x, y);
    let rx = relative.x << 0;
    let ry = relative.y << 0;
    ctx.fillStyle = "#fff";
    ctx.font = `${this.camera.scale}px Arial`;
    ctx.fillText(`(x:${rx}, y:${ry})`, x, y);
  }

  drawGrid() {

    let ctx = this.ctx;

    let size = (this.grid.factor * this.camera.scale) | 0;

    let xx = (this.camera.position.x % size) | 0;
    let yy = (this.camera.position.y % size) | 0;

    let width = this.camera.size.x | 0;
    let height = this.camera.size.y | 0;

    ctx.lineWidth = .5;

    // draw grid
    ctx.beginPath();
    for (; xx < width; xx += size) {
      ctx.moveTo(xx, 0);
      ctx.lineTo(xx, height);
    };
    for (; yy < height; yy += size) {
      ctx.moveTo(0, yy);
      ctx.lineTo(width, yy);
    };
    ctx.stroke();
    ctx.closePath();

  }

  drawMap() {

    let ctx = this.ctx;

    let x = 0;
    let y = 0;

    let scale = this.camera.scale;

    let cx = this.camera.position.x | 0;
    let cy = this.camera.position.y | 0;

    let width = (this.grid.width * scale) | 0;
    let height = (this.grid.height * scale) | 0;

    ctx.globalAlpha = .1;
    ctx.fillStyle = "#FFF";
    ctx.fillRect(cx + x, cy + y, width, height);
    ctx.globalAlpha = 1.0;

  }

  drawEntities() {

    let ii = 0;
    let length = this.entities.length;

    for (; ii < length; ++ii) {
      this.drawEntity(this.entities[ii]);
    };

  }

  /**
   * @param {Object} entity
   */
  drawEntity(entity) {

    let ctx = this.ctx;

    let scale = this.camera.scale;

    let cx = this.camera.position.x | 0;
    let cy = this.camera.position.y | 0;

    let x = (cx + (entity.position.x * scale)) | 0;
    let y = (cy + (entity.position.y * scale)) | 0;

    let width = (entity.size.x * scale) | 0;
    let height = (entity.size.y * scale) | 0;

    if (DEV_MODE === true) {
      ctx.globalAlpha = .1;
      ctx.fillStyle = "blue";
      ctx.fillRect(x, y, width, height);
      ctx.globalAlpha = 1.0;
    }

    if (entity.hasTexture && entity.texture.isLoaded) {
      let buffer = entity.texture.buffer.canvas;
      //console.log(entity.texture.width / entity.size.x, entity.texture.height / entity.size.y);
      /*ctx.drawImage(
        entity.texture.buffer.canvas,
        0, 0,
        entity.width * 2, entity.height * 2,
        x, y,
        width, height
      );*/
      ctx.drawImage(
        buffer,
        (entity.size.x * entity.frame) * 2, (entity.size.y * entity.frameIdx) * 2,
        entity.size.x * 2, entity.size.y * 2,
        x, y,
        width, height
      );
      if (DEV_MODE === true) {
        if (entity.isCollidable === true) {
          this.drawCollisionBox(entity, x, y);
        }
      }
    }

  }

  /**
   * @param {MapEntity} entity
   * @param {Number} x
   * @param {Number} y
   */
  drawCollisionBox(entity, x, y) {
    let ii = 0;
    let xx = 0;
    let yy = 0;
    let tile = 0;
    let width = entity.size.x;
    let height = entity.size.y;
    let length = width * height;

    let dim = this.camera.scale;

    let ctx = this.ctx;
    let collision = entity.collisionBox;

    for (; ii < length; ++ii) {
      tile = collision[yy + xx];
      if (tile === 1) {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = "red";
        ctx.fillRect(
          x + (xx * dim),
          y + ((yy / width) * dim),
          dim, dim
        );
        ctx.globalAlpha = 1.0;
      }
      ++xx;
      if (xx >= width) {
        yy += width;
        xx = 0;
      }
    };

  }

  sort() {

    let array = this.entities;

    let ii = 0;
    let jj = 0;
    let key = null;
    let length = array.length;

    for (; ii < length; ++ii) {
      jj = ii;
      key = array[jj];
      for (; jj > 0 && array[jj - 1].position.y > key.position.y; --jj) {
        array[jj] = array[jj - 1];
      };
      array[jj] = key;
    };
  }

  onResize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.node.width = width;
    this.node.height = height;
    this.camera.onResize(width, height);
    this.ctx.imageSmoothing = false;
  }

}