import ws from "ws";

import User from "./User";
import NetworkEntity from "../shared/NetworkEntity";

import {
  WS_PORT,
  SERVER_FPS,
  MAX_CONNECTIONS
} from "../cfg";

import {
  isValidPacket,
  PID, TYPE, PACKET
} from "../packet";

/**
 * @class
 */
export default class Server {

  /** @constructor */
  constructor() {

    this.ws = null;

    this.traffic = 0;

    this.users = [];

    this.listen();

    this.options = { binary: true };

  }

  /**
   * @param {String} str
   * @param {Number} cc
   */
  print(str, cc) {
    console.log(`\x1b[${cc}m%s\x1b[0m:`, str);
  }

  listen() {
    this.ws = new ws.Server({
      port: WS_PORT,
      perMessageDeflate: false
    });
    this.ws.on("error", this::this.onError);
    this.ws.on("connection", this::this.onConnection);
  }

  /**
   * @param {Error} e
   */
  onError(e) {
    this.print(e, 31);
  }

  /**
   * @param {Object} e
   */
  onConnection(e) {
    if (this.users.length >= MAX_CONNECTIONS) return void 0;
    let user = new User(e, this);
    this.users.push(user);
    e.on("message", user::user.onMessage);
    e.on("close", user::user.onClose);
    user.sendHandshake();
  }

  /**
   * @param {User} user
   */
  removeUser(user) {
    let ii = 0;
    let users = this.users;
    for (; ii < users.length; ++ii) {
      if (users[ii].uid === user.uid) {
        this.users[ii] = null;
        this.users.splice(ii, 1);
      }
    };
  }

}