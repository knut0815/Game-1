import {
  encodePacket,
  decodePacket,
  encodeString,
  decodeString,
  isValidPacket,
  PID, TYPE, PACKET
} from "../../packet";

/**
 * @param {Array*} data
 */
export function handleHandshake(data) {
  let username = decodeString(data.slice(1));
  // already connected or chose invalid username
  if (this.isAlreadyConnected(username) || !this.isValidUsername(username)) {
    this.socket.close();
    return void 0;
  }
  // already authenticated
  if (this.isAuthenticated) return void 0;
  // set username
  this.username = username;
  this.usernameBinary = encodeString(username);
  console.log(this.uid + " chose username " + this.username);
  // broadcast player join
  let packet = encodePacket([PID.JOIN, this.uid, ...this.usernameBinary]);
  this.isAuthenticated = true;
  this.users.push(this);
  // send back handshake
  this.send(encodePacket([PID.HANDSHAKE]));
  this.broadcast(packet);
}

/**
 * @param {Array*} data
 */
export function handleJump() {
  console.log(this.username + " jumped");
  let packet = encodePacket([PID.JUMP, this.uid]);
  this.broadcast(packet);
}

export function handleNearbyPlayers() {
  console.log(this.username + " wants nearby players");
  let data = [PID.NEARBY_PLAYERS];
  let ii = 0;
  let users = this.users;
  for (; ii < users.length; ++ii) {
    if (users[ii].uid !== this.uid) {
      // add user id
      data.push(users[ii].uid);
      // add username as binary
      data.push(...users[ii].usernameBinary);
      // add comma
      if (ii + 1 < users.length) data.push(44);
    }
  };
  this.send(encodePacket(data));
}

/**
 * @param {Array*} data
 */
export function handleMove(data) {
  switch (data[1]) {
    case 37:
      console.log(this.username + " moved left");
    break;
    case 39:
      console.log(this.username + " moved right");
    break;
    case 38:
      console.log(this.username + " moved up");
    break;
    case 40:
      console.log(this.username + " moved down");
    break;
  };
  let packet = encodePacket([PID.MOVE, this.uid, data[1]]);
  this.broadcast(packet);
}

/**
 * @param {Array*} data
 */
export function handleGlobalMessage(data) {
  console.log(this.username + " shouted " + decodeString(data.slice(1)));
  let packet = encodePacket([PID.GLOBAL_MESSAGE, this.uid, ...encodeString(":"), ...data.slice(1)]);
  this.broadcast(packet);
}

/**
 * @param {Array*} data
 */
export function handlePrivateMessage(data) {
  let msg = decodeString(data.slice(1));
  let split = msg.split(":");
  let recipient = split[0];
  if (recipient === this.username) return void 0;
  if (split.length >= 1 && split[1].length) {
    console.log(this.username + " whispered to " + recipient + ":" + split[1]);
  }
  let packet = encodePacket([PID.PRIVATE_MESSAGE, this.uid, ...encodeString(split[1])]);
  this.sendToUserByUsername(packet, recipient);
}