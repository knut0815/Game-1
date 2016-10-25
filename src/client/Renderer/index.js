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
    this.clear();
    this.drawGrid();
    this.drawMap();
    this.drawEntities();
    window.requestAnimationFrame(() => this.draw());
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

    ctx.globalAlpha = .25;
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

    let x = (cx + (entity.x * scale)) | 0;
    let y = (cy + (entity.y * scale)) | 0;

    let width = (entity.width * scale) | 0;
    let height = (entity.height * scale) | 0;

    ctx.globalAlpha = .45;
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width, height);
    ctx.globalAlpha = 1.0;

    if (entity.hasTexture && entity.texture.isLoaded) {
      let buffer = entity.texture.buffer.canvas;
      //console.log(entity.texture.width / entity.width, entity.texture.height / entity.height);
      /*ctx.drawImage(
        entity.texture.buffer.canvas,
        0, 0,
        entity.width * 2, entity.height * 2,
        x, y,
        width, height
      );*/
      ctx.drawImage(
        buffer,
        (entity.width * 3) * 2, (entity.height * entity.frame) * 2,
        entity.width * 2, entity.height * 2,
        x, y,
        width, height
      );
    }

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