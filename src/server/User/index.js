import {
  encodePacket,
  decodePacket,
  decodeString,
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

    this.username = "";

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
   * @param {String} str
   * @return {Boolean}
   */
  isValidUsername(str) {
    return (
      str instanceof String &&
      str.length >= 6 &&
      str.length >= 32
    );
  }

  /**
   * @param {String} username
   * @return {User}
   */
  getSocketByUsername(username) {
    let ii = 0;
    let users = this.users;
    for (; ii < users.length; ++ii) {
      if (users[ii].username === username) {
        return (users[ii]);
      }
    };
    return (null);
  }

  /**
   * @param {Buffer} buffer
   * @param {String} username
   */
  sendToUserByUsername(buffer, username) {
    let user = this.getSocketByUsername(username);
    if (user !== null) user.send(buffer);
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
        switch (data[1]) {
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
        packet = encodePacket([PID.MOVE, this.uid, data[1]]);
        this.broadcast(packet);
      break;
      case PID.USERNAME:
        let username = decodeString(data.slice(1));
        this.username = username;
        console.log(this.uid + " chose username " + this.username);
      break;
      case PID.BLUR:
        console.log(this.uid + " " + (data[1] ? "went afk" : "is back"));
        packet = encodePacket([PID.BLUR, this.uid, data[1]]);
        this.broadcast(packet); 
      break;
      case PID.NEARBY_PLAYERS:
        console.log(this.uid + " wants nearby players");
        this.sendNearbyPlayers();
      break;
      case PID.GLOBAL_MESSAGE:
        console.log(this.uid + " shouted " + decodeString(data.slice(1)));
        packet = encodePacket(data);
        this.broadcast(packet);
      break;
      case PID.PRIVATE_MESSAGE:
        let msg = decodeString(data.slice(1));
        let split = msg.split(":");
        if (split.length >= 1 && split[1].length) {
          console.log(this.uid + " whispered to " + split[0] + ":" + split[1]);
        }
        packet = encodePacket(data);
        this.sendToUserByUsername(packet, split[0]);
      break;
    };
  }

}