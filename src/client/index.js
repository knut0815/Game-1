import Grid from "./Grid";
import Network from "./Network";
import Renderer from "./Renderer";

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
    this.grid = new Grid(this);
    this.network = new Network(this);
    this.renderer = new Renderer(this);
  }

}

let client = new Client();

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
      packet = encodePacket([PID.MOVE, e.keyCode]);
      client.network.send(packet);
    break;
  };

});

window.addEventListener("blur", (e) => {
  client.network.send(encodePacket([PID.BLUR, 1]));
});

window.addEventListener("focus", (e) => {
  client.network.send(encodePacket([PID.BLUR, 0]));
});

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
});