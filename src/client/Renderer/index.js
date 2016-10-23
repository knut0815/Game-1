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
    this.instance = instance;

    this.scale = 8;
    this.width = 0;
    this.height = 0;

    this.node = instance.node;
    this.ctx = this.node.getContext("2d");

    window.addEventListener("resize", this::this.onResize);

    this.init();

  }

  init() {
    this.onResize();
    this.draw();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  draw() {
    this.clear();
    this.drawGrid();
    this.drawEntities();
    window.requestAnimationFrame(() => this.draw());
  }

  drawGrid() {
    let xx = 0;
    let yy = 0;
    let size = this.grid.factor * this.scale;
    let ctx = this.ctx;
    let width = this.width;
    let height = this.height;
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

  drawEntities() {

  }

  onResize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.width = width;
    this.height = height;
    this.node.width = width;
    this.node.height = height;
  }

}