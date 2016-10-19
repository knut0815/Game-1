import Network from "./Network";

import {
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
    this.network = new Network(this);
  }

}

let client = new Client();

window.addEventListener("keydown", (e) => {

  switch (e.keyCode) {
    /*case 37:
      console.log("left");
    break;
    case 39:
      console.log("right");
    break;
    case 38:
      console.log("up");
    break;
    case 40:
      console.log("down");
    break;*/
    case 32:
      client.network.send(
        new Uint8Array([PID.JUMP]).buffer
      );
    break;
    case 37:
    case 39:
    case 38:
    case 40:
      client.network.send(
        new Uint8Array([PID.MOVE, e.keyCode]).buffer
      );
    break;
  };

});

window.addEventListener("blur", (e) => {
  console.log("Window blurred!");
});