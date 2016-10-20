import {
  WS_PORT
} from "../../cfg";

import {
  encodePacket,
  decodePacket,
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
    console.log("Sending handshake..");
    this.sendHandshake();
  }

  sendHandshake() {
    let data = [PID.HANDSHAKE, 0];
    let buffer = new Uint8Array(data).buffer;
    this.send(buffer);
  }

  getNearbyPlayers() {
    let data = [PID.NEARBY_PLAYERS];
    let buffer = new Uint8Array(data).buffer;
    this.send(buffer);
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
   * @param {Buffer} buffer
   */
  processPacket(buffer) {
    let packet = decodePacket(buffer);
    let type = packet[0];
    let user = packet[1];
    switch (type) {
      case PID.HANDSHAKE:
        console.log("Received handshake!");
        console.log("Client id is " + user);
        this.getNearbyPlayers();
      break;
      case PID.JOIN:
        console.log(user + " joined");
      break;
      case PID.EXIT:
        console.log(user + " left");
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
        let players = "";
        let index = 0;
        for (let ii = 0; ii < packet.length; ++ii) {
          if (ii > 0) {
            players += packet[ii];
            if (ii + 1 < packet.length) players += ", ";
          }
        };
        console.log("Nearby players: " + players);
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