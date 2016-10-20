import {
  encodePacket,
  decodePacket,
  isValidPacket,
  PID, TYPE, PACKET
} from "../../packet";

import {
  getUniqueHash
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

    this.instance = instance;

    this.width = 0;
    this.height = 0;

    this.node = document.querySelector("#game");
    this.onResize();

    window.addEventListener("resize", this::this.onResize);

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