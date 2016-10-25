import Grid from "./Grid";
import Camera from "./Camera";
import Network from "./Network";
import Renderer from "./Renderer";

import MapEntity from "../shared/MapEntity";

import poly from "../polyfill";

import {
  pointIntersectsEntity
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

let local = null;
let selection = null;

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
    this.addLocalPlayer({
      x: 8,
      y: 8
    });
    /*this.entities.push(new MapEntity({
      x: 0,
      y: 0,
      width: 4,
      height: 4,
      collisionBox: [
        1, 1, 1, 1,
        1, 0, 0, 1,
        1, 0, 0, 1,
        1, 1, 1, 1
      ]
    }));*/
  }

  addPlayer(obj) {
    obj.width = 7;
    obj.height = 12;
    obj.url = "assets/sprites/player_sheet.png";
    obj.collisionBox = [
      1, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
      0, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 0,
      0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 1
    ];
    let entity = new MapEntity(obj);
    this.entities.push(entity);
    return (entity);
  }

  addLocalPlayer(obj) {
    let entity = this.addPlayer(obj);
    entity.isLocal = true;
    local = entity;
  }

  getEntityByPosition(x, y) {
    let xx = x << 0;
    let yy = y << 0;
    let ii = 0;
    let length = this.entities.length;
    let entity = null;
    for (; ii < length; ++ii) {
      entity = this.entities[ii];
      if (pointIntersectsEntity(xx, yy, entity)) {
        return (entity);
      }
    };
    return (null);
  }

  getEntityBySessionId(id) {
    let ii = 0;
    let length = this.entities.length;
    let entity = null;
    for (; ii < length; ++ii) {
      entity = this.entities[ii];
      if (entity.id === id) {
        return (entity);
      }
    };
    return (null);
  }

  /**
   * @param {NetworkEntity} session
   */
  onJoin(session) {
    this.addPlayer({
      id: session.id,
      x: 8,
      y: 8
    });
  }

  /**
   * @param {NetworkEntity} session
   */
  onExit(session) {
    let ii = 0;
    let length = this.entities.length;
    let entity = null;
    for (; ii < length; ++ii) {
      entity = this.entities[ii];
      if (entity.id === session.id) {
        this.entities.splice(ii, 1);
        break;
      }
    };
  }

  /**
   * @param {NetworkEntity} session
   */
  onMove(session, key) {
    let entity = this.getEntityBySessionId(session.id);
    let speed = 1;
    if (key === 37) {
      entity.onMove(speed, 0);
    }
    if (key === 39) {
      entity.onMove(-speed, 0);
    }
    if (key === 38) {
      entity.onMove(0, speed);
    }
    if (key === 40) {
      entity.onMove(0, -speed);
    }
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  onClick(x, y) {
    let position = client.camera.getGameRelativeOffset(x, y);
    selection = client.getEntityByPosition(position.x, position.y);
    if (selection === null) {
      client.camera.drag.x = x;
      client.camera.drag.y = y;
    } else {
      console.log(selection);
    }
  }

}

let keys = {
  LEFT: false,
  UP: false,
  RIGHT: false,
  DOWN: false
};

let client = new Client();
window.client = client;
window.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 37:
      keys.LEFT = true;
    break;
    case 39:
      keys.UP = true;
    break;
    case 38:
      keys.RIGHT = true;
    break;
    case 40:
      keys.DOWN = true;
    break;
  };
});
window.addEventListener("keyup", (e) => {
  switch (e.keyCode) {
    case 37:
      keys.LEFT = false;
    break;
    case 39:
      keys.UP = false;
    break;
    case 38:
      keys.RIGHT = false;
    break;
    case 40:
      keys.DOWN = false;
    break;
  };
});

setInterval(() => {
  // movement
  let speed = 1;
  let packet = null;
  for (let key in keys) {
    if (keys[key] === true) {
      if (key === "LEFT") {
        client.network.send(encodePacket([PID.MOVE, 37]));
        local.onMove(speed, 0);
      }
      if (key === "UP") {
        client.network.send(encodePacket([PID.MOVE, 39]));
        local.onMove(-speed, 0);
      }
      if (key === "RIGHT") {
        client.network.send(encodePacket([PID.MOVE, 38]));
        local.onMove(0, speed);
      }
      if (key === "DOWN") {
        client.network.send(encodePacket([PID.MOVE, 40]));
        local.onMove(0, -speed);
      }
    }
  };
}, 1e3/30);

window.addEventListener("mousewheel", (e) => {
  e.preventDefault();
  let value = (e.deltaY > 0 ? -1 : 1);
  client.camera.onClick(e.clientX, e.clientY);
  client.camera.onScale(value);
});

let isMouseDown = false;
game.addEventListener("mousedown", (e) => {
  e.preventDefault();
  client.onClick(e.clientX, e.clientY);
  isMouseDown = true;
});
game.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

game.addEventListener("mousemove", (e) => {
  e.preventDefault();
  if (!isMouseDown || selection !== null) return void 0;
  client.camera.onDrag(e.clientX, e.clientY);
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