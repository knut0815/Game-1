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
export default class User {

  /**
   * @param {WebSocket} socket
   * @param {Client} instance
   * @constructor
   */
  constructor(socket, instance) {

    this.uid = getUniqueHash();

    this.socket = socket;
    this.instance = instance;
    this.users = instance.users;

  }

  sendHandshake() {
    let data = [PID.HANDSHAKE, this.uid];
    let packet = encodePacket(data);
    this.send(packet);
  }

  sendNearbyPlayers() {
    let data = [PID.NEARBY_PLAYERS];
    let ii = 0;
    let users = this.users;
    let packet = null;
    for (; ii < users.length; ++ii) {
      if (users[ii].uid !== this.uid) {
        data.push(users[ii].uid);
      }
    };
    packet = encodePacket(data);
    this.send(packet);
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
    let users = this.users;
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
      let packet = decodePacket(buffer);
      this.processPacket(packet);
    }
  }

  onClose() {
    this.broadcast(
      new Uint8Array([PID.EXIT, this.uid])
    );
    this.instance.removeUser(this);
    this.socket.close();
  }

  /**
   * @param {Array*} data
   */
  processPacket(data) {
    let type = data[0];
    let packet = null;
    switch (type) {
      case PID.HANDSHAKE:
        console.log(this.uid + " joined");
        packet = encodePacket([PID.JOIN, this.uid]);
        this.broadcast(packet);
      break;
      case PID.JUMP:
        console.log(this.uid + " jumped");
        packet = encodePacket([PID.JUMP, this.uid]);
        this.broadcast(packet);
      break;
      case PID.MOVE:
        let key = data[1];
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
        packet = encodePacket([PID.MOVE, this.uid, key]);
        this.broadcast(packet);
      break;
      case PID.NEARBY_PLAYERS:
        console.log(this.uid + " wants nearby players");
        this.sendNearbyPlayers();
      break;
    };
  }

}