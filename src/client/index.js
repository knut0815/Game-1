import Grid from "./Grid";
import Camera from "./Camera";
import Network from "./Network";
import Renderer from "./Renderer";

import poly from "../polyfill";

import {
  pointIntersectsRectangle
} from "../math";

import {
  encodePacket,
  decodePacket,
  encodeString,
  isValidPacket,
  PID, TYPE, PACKET
} from "../packet";

// ws support
if (window.WebSocket === void 0) throw new Error("Your browser doesnt support WebSockets");

/**
 * @class
 */
export default class Client {

  /** @constructor */
  constructor() {
    this.node = game;
    this.entities = [];
    this.grid = new Grid(this);
    this.camera = new Camera(this);
    this.network = new Network(this);
    this.renderer = new Renderer(this);
    this.init();
  }

  init() {
    this.entities.push({
      x: 8,
      y: 8,
      width: 16,
      height: 16
    });
  }

  getEntityByPosition(x, y) {
    let xx = x << 0;
    let yy = y << 0;
    let ii = 0;
    let length = this.entities.length;
    let entity = null;
    for (; ii < length; ++ii) {
      entity = this.entities[ii];
      if (pointIntersectsRectangle(xx, yy, entity.x, entity.y, entity.width, entity.height)) {
        return (entity);
      }
    };
    return (null);
  }

}

let client = new Client();
window.client = client;
window.addEventListener("keydown", (e) => {

  let packet = null;

  switch (e.keyCode) {
    case 32:
      packet = encodePacket([PID.JUMP]);
      client.network.send(packet);
    break;
    case 37:
    case 39:
    case 38:
    case 40:
      let speed = 10;
      if (e.keyCode === 37) {
        client.camera.onMove(speed, 0, 0);
      } else if (e.keyCode === 39) {
        client.camera.onMove(-speed, 0, 0);
      } else if (e.keyCode === 38) {
        client.camera.onMove(0, speed, 0);
      } else if (e.keyCode === 40) {
        client.camera.onMove(0, -speed, 0);
      }
      packet = encodePacket([PID.MOVE, e.keyCode]);
      client.network.send(packet);
    break;
  };

});

window.addEventListener("mousewheel", (e) => {
  e.preventDefault();
  let value = (e.deltaY > 0 ? -1 : 1);
  client.camera.onScale(value);
});

let selection = null;
let isMouseDown = false;
game.addEventListener("mousedown", (e) => {
  e.preventDefault();
  let x = e.clientX;
  let y = e.clientY;
  let position = client.camera.getGameRelativeOffset(x, y);
  selection = client.getEntityByPosition(position.x, position.y);
  if (selection === null) {
    client.camera.drag.x = x / client.camera.scale;
    client.camera.drag.y = y / client.camera.scale;
  }
  else {
    console.log(selection);
  }
  isMouseDown = true;
});

game.addEventListener("mousemove", (e) => {
  e.preventDefault();
  if (!isMouseDown || selection !== null) return void 0;
  let x = e.clientX / client.camera.scale;
  let y = e.clientY / client.camera.scale;
  client.camera.onDrag(x, y);
});

game.addEventListener("mouseup", (e) => {
  e.preventDefault();
  isMouseDown = false;
});

/*
send_global.addEventListener("click", (e) => {
  let txt = global_msg.value;
  let data = encodeString(txt);
  data.unshift(PID.GLOBAL_MESSAGE);
  client.network.send(encodePacket(data));
});

send_private.addEventListener("click", (e) => {
  let data = null;
  data = encodeString(recipient.value);
  data = data.concat(encodeString(":"));
  data = data.concat(encodeString(private_msg.value));
  data.unshift(PID.PRIVATE_MESSAGE);
  client.network.send(encodePacket(data));
});*/