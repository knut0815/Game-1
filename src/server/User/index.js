import {
  isValidPacket,
  PID, TYPE, PACKET
} from "../../packet";

import {
  getUniqueHash
} from "../../utils";

/**
 * @class
 */
export default class User {

  /** @constructor */
  constructor(socket, instance) {

    this.uid = getUniqueHash();

    this.socket = socket;
    this.instance = instance;

  }

  sendHandshake() {
    let data = [PID.HANDSHAKE, this.uid];
    let buffer = new Uint8Array(data).buffer;
    this.send(buffer);
  }

  /**
   * @param {Buffer} buffer
   */
  send(buffer) {
    this.socket.send(buffer, this.instance.options);
  }

  /**
   * @param {Buffer} buffer
   */
  broadcast(buffer) {
    let ii = 0;
    let users = this.instance.users;
    for (; ii < users.length; ++ii) {
      if (users[ii].uid !== this.uid) {
        users[ii].send(buffer);
      }
    };
  }

  /**
   * @param {Buffer} buffer
   */
  onMessage(buffer) {
    if (buffer instanceof Buffer && buffer.length >= 1) {
      let view = new DataView(new Uint8Array(buffer).buffer);
      if (isValidPacket(view)) {
        this.processMessage(view);
      }
    }
  }

  onClose() {
    this.instance.removeUser(this);
    this.socket.close();
  }

  /**
   * @param {DataView} view
   */
  processMessage(view) {
    let type = view.getUint8(0);
    switch (type) {
      case PID.HANDSHAKE:
        console.log("handshake");
      break;
      case PID.JUMP:
        console.log(this.uid + " jumped");
        this.broadcast(
          new Uint8Array([PID.JUMP, this.uid]).buffer
        );
      break;
      case PID.MOVE:
        let key = view.getUint8(1);
        switch (key) {
          case 37:
            console.log(this.uid + " moved left");
          break;
          case 39:
            console.log(this.uid + " moved right");
          break;
          case 38:
            console.log(this.uid + " moved up");
          break;
          case 40:
            console.log(this.uid + " moved down");
          break;
        };
        this.broadcast(
          new Uint8Array([PID.MOVE, this.uid, key]).buffer
        );
      break;
    };
  }

}