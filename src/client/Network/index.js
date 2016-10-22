import {
  WS_PORT
} from "../../cfg";

import {
  encodePacket,
  decodePacket,
  encodeString,
  decodeString,
  isValidPacket,
  PID, TYPE, PACKET
} from "../../packet";

/**
 * @class
 */
export default class Network {

  /** @constructor */
  constructor() {
    this.ws = null;
    this.users = [];
    this.connect();
  }

  /**
   * @return {String}
   */
  getConnectionUrl() {
    let host = document.location.hostname;
    let protocol = location.protocol === "https:" ? protocol = "wss://" : "ws://";
    return (`${protocol}${host}:${WS_PORT}`);
  }

  connect() {
    let Socket = window.MozWebSocket || window.WebSocket;
    let url = this.getConnectionUrl();
    this.ws = new Socket(url);
    this.ws.binaryType = "arraybuffer";
    this.addEventListeners();
  }

  addEventListeners() {
    this.ws.addEventListener("open", this::this.onOpen);
    this.ws.addEventListener("close", this::this.onClose);
    this.ws.addEventListener("error", this::this.onError);
    this.ws.addEventListener("message", this::this.onMessage);
  }

  onOpen() {
    console.info(`Opened WebSocket connection to ${this.getConnectionUrl()}`);
    // send handshake
    console.log("Sending handshake..");
    this.sendHandshake();
  }

  sendHandshake() {
    let data = [PID.HANDSHAKE];
    let username = window.location.search.split("username=")[1];
    data.pushString(username);
    let packet = encodePacket(data);
    this.send(packet);
  }

  getNearbyPlayers() {
    let packet = encodePacket([PID.NEARBY_PLAYERS]);
    this.send(packet);
  }

  onClose() {
    console.error(`Closed WebSocket connection to ${this.getConnectionUrl()}`);
  }

  onError(e) {
    console.error(e);
  }

  onMessage(e) {
    let data = e.data;
    if (data instanceof ArrayBuffer && data.byteLength >= 1) {
      this.processPacket(new Buffer(data));
    }
  }

  /**
   * @param {Number} id
   * @return {Number}
   */
  getUserIndexById(id) {
    let ii = 0;
    let users = this.users;
    for (; ii < users.length; ++ii) {
      if (users[ii].id === id) return (ii);
    };
    return (-1);
  }

  /**
   * @param {Number} id
   */
  removeUserById(id) {
    let idx = this.getUserIndexById(id);
    if (idx !== -1) this.users.splice(idx, 1);
  }

  /**
   * @param {Number} id
   * @return {Object}
   */
  getUserById(id) {
    let idx = this.getUserIndexById(id);
    return (this.users[idx] || null);
  }

  /**
   * @param {Array*} packet
   */
  decodeNearbyPlayers(packet) {
    let ii = 1;
    let length = packet.length;
    let id = 0;
    let idx = 0;
    let obj = null;
    let username = "";
    for (; ii < length; ++ii) {
      id = packet[ii];
      ii++;
      while (packet[ii] !== 44) {
        username += String.fromCharCode(packet[ii++]);
      };
      idx = this.getUserIndexById(id);
      obj = {
        id: id,
        username: username
      };
      // already exists
      if (idx !== -1) {
        this.users[idx] = obj;
      }
      this.users.push(obj);
      username = "";
    };
  }

  /**
   * @param {Buffer} buffer
   */
  processPacket(buffer) {
    let packet = decodePacket(buffer);
    let type = packet[0];
    let sessionId = packet[1];
    let session = this.getUserById(sessionId);
    let user = session ? session.username : session;
    switch (type) {
      case PID.HANDSHAKE:
        console.log("Received handshake!");
        this.getNearbyPlayers();
      break;
      case PID.JOIN:
        console.log(packet);
        this.users.push({
          id: sessionId,
          username: decodeString(packet.slice(2))
        });
        console.log(this.users[this.users.length - 1].username + " joined");
      break;
      case PID.EXIT:
        console.log(user + " left");
        this.removeUserById(sessionId);
      break;
      case PID.JUMP:
        console.log(user + " jumped!");
      break;
      case PID.MOVE:
        let key = packet[2];
        switch (key) {
          case 37:
            console.log(user + " moved left");
          break;
          case 39:
            console.log(user + " moved right");
          break;
          case 38:
            console.log(user + " moved up");
          break;
          case 40:
            console.log(user + " moved down");
          break;
        };
      break;
      case PID.NEARBY_PLAYERS:
        this.decodeNearbyPlayers(packet);
        this.users.map((user) => {
          console.log(user.id, user.username);
        });
      break;
      case PID.GLOBAL_MESSAGE:
        let str = decodeString(packet.slice(2));
        let msg = str.split(":")[1];
        console.log(user, this.users);
        console.log(user + ":" + msg);
      break;
      case PID.PRIVATE_MESSAGE:
        console.log(user + ":" + decodeString(packet.slice(1)));
      break;
    };
  }

  /**
   * @param {Buffer} buffer
   */
  send(buffer) {
    this.ws.send(buffer);
  }

}