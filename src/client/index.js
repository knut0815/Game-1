import Grid from "./Grid";
import Camera from "./Camera";
import Network from "./Network";
import Renderer from "./Renderer";

import MapEntity from "../shared/MapEntity";

import poly from "../polyfill";

import {
  Point,
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
    this.mousePosition = new Point(0, 0);
    this.grid = new Grid(this);
    this.camera = new Camera(this);
    this.network = new Network(this);
    this.renderer = new Renderer(this);
    this.init();
  }

  /**
   * @param {MapEntity} entity
   */
  updateEntity(entity) {
    if (entity.animations.length <= 0) return void 0;
    let ii = 0;
    let animation = null;
    for (; ii < entity.animations.length; ++ii) {
      animation = entity.animations[ii];
      animation.play();
      if (animation.isFinished === true) {
        entity.animations.splice(ii, 1);
      }
    };
  }

  updateLogic() {
    let ii = 0;
    for (; ii < this.entities.length; ++ii) {
      this.updateEntity(this.entities[ii]);
    };
  }

  initLoops() {
    this.renderer.init();
    setInterval(() => {
      this.updateKeys();
      this.updateLogic();
    }, 30);
  }

  updateKeys() {
    // movement
    let spd = 1;
    let packet = null;
    for (let key in keys) {
      if (keys[key] === true) {
        if (!local.isMoving) {
          if (key === "LEFT") local.onMove(spd, 0);
          if (key === "UP") local.onMove(-spd, 0);
          if (key === "RIGHT") local.onMove(0, spd);
          if (key === "DOWN") local.onMove(0, -spd);
          local.moveKeyPressed = true;
        }
      }
      local.moveKeyPressed = false;
    };
  }

  init() {
    this.initLoops();
    this.addLocalPlayer({
      x: 14,
      y: 8
    });
    let scale = localStorage.getItem("dox::scale");
    let position = localStorage.getItem("dox::position");
    if (scale !== null && position !== null) {
      let pos = position.split(",");
      this.camera.scale = scale << 0;
      this.camera.position.x = parseFloat(pos[0]);
      this.camera.position.y = parseFloat(pos[1]);
    } else {
      localStorage.setItem("dox::scale", this.camera.scale);
      localStorage.setItem("dox::position", this.camera.position.x + "," + this.camera.position.y);
    }
  }

  addPlayer(obj) {
    obj.width = 7;
    obj.height = 12;
    obj.frames = 6;
    obj.url = "assets/sprites/player_sheet.png";
    obj.collisionBox = [
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 1, 1, 0, 0,
      0, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 0,
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0
    ];
    //obj.collidable = false;
    let entity = new MapEntity(obj);
    this.entities.push(entity);
    return (entity);
  }

  addLocalPlayer(obj) {
    let entity = this.addPlayer(obj);
    entity.isLocal = true;
    local = entity;
    this.camera.setFollow(local);
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

  /**
   * @param {Number} x
   * @param {Number} y
   */
  onMouseMove(x, y) {
    //console.log(x, y);
    client.mousePosition.x = x;
    client.mousePosition.y = y; 
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
  client.onMouseMove(e.clientX, e.clientY);
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