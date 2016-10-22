import {
  encodePacket,
  decodePacket,
  encodeString,
  decodeString,
  isValidPacket,
  PID, TYPE, PACKET
} from "../../packet";

import {
  inherit,
  getUniqueHash
} from "../../utils";

import * as handlers from "./handler";

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

    /**
     * To detect packet loss
     */
    this.pid = 0;

    /**
     * Keep track of the last 100
     * packets, so we can send them
     * in case client got out of sync
     */
    this.packets = [];

    this.username = "";
    this.usernameBinary = null;

    this.isAuthenticated = false;

    this.socket = socket;
    this.instance = instance;
    this.users = instance.users;

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
      str.length >= 3 &&
      str.length <= 16
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
   * @param {String} username
   * @return {Boolean}
   */
  isAlreadyConnected(username) {
    return (
      this.getSocketByUsername(username) !== null
    );
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
    // user didnt pass auth ever,
    // so better dont annoy anyone
    if (this.isAuthenticated) {
      this.broadcast(
        new Uint8Array([PID.EXIT, this.uid])
      );
      this.instance.removeUser(this);
    }
    this.socket.close();
  }

  /**
   * @param {Array*} data
   */
  processPacket(data) {
    let type = data[0];
    let packet = null;
    // u shall not pass bitch
    if (!this.isAuthenticated && type !== PID.HANDSHAKE) {
      return void 0;
    }
    switch (type) {
      case PID.HANDSHAKE:
        this.handleHandshake(data);
      break;
      case PID.JUMP:
        this.handleJump(data);
      break;
      case PID.MOVE:
        this.handleMove(data);
      break;
      case PID.NEARBY_PLAYERS:
        this.handleNearbyPlayers();
      break;
      case PID.GLOBAL_MESSAGE:
        this.handleGlobalMessage(data);
      break;
      case PID.PRIVATE_MESSAGE:
        this.handlePrivateMessage(data);
      break;
    };
  }

}

inherit(User, handlers);