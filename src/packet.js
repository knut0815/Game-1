let idx = 0;

export const PID = {};
PID[PID["BLUR"] = idx++] = "BLUR";
PID[PID["JOIN"] = idx++] = "JOIN";
PID[PID["EXIT"] = idx++] = "EXIT";
PID[PID["MOVE"] = idx++] = "MOVE";
PID[PID["JUMP"] = idx++] = "JUMP";
PID[PID["USERNAME"] = idx++] = "USERNAME";
PID[PID["HANDSHAKE"] = idx++] = "HANDSHAKE";
PID[PID["NEARBY_PLAYERS"] = idx++] = "NEARBY_PLAYERS";
PID[PID["GLOBAL_MESSAGE"] = idx++] = "GLOBAL_MESSAGE";
PID[PID["PRIVATE_MESSAGE"] = idx++] = "PRIVATE_MESSAGE";

export const TYPE = {};
TYPE[TYPE["INT8"] = idx++] = "INT8";
TYPE[TYPE["INT16"] = idx++] = "INT16";
TYPE[TYPE["INT32"] = idx++] = "INT32";
TYPE[TYPE["UINT8"] = idx++] = "UINT8";
TYPE[TYPE["UINT16"] = idx++] = "UINT16";
TYPE[TYPE["UINT32"] = idx++] = "UINT32";
TYPE[TYPE["FLOAT32"] = idx++] = "FLOAT32";
TYPE[TYPE["FLOAT64"] = idx++] = "FLOAT64";

export const PACKET = {
  BLUR: {
    kind: TYPE.UINT8,
    broadcast: true
  },
  JOIN: {
    kind: TYPE.UINT8,
    broadcast: true
  },
  EXIT: {
    kind: TYPE.UINT8,
    broadcast: true
  },
  MOVE: {
    kind: TYPE.UINT16,
    broadcast: true
  },
  JUMP: {
    kind: TYPE.UINT8,
    broadcast: true
  },
  USERNAME: {
    kind: TYPE.UINT8,
    broadcast: false
  },
  GLOBAL_MESSAGE: {
    kind: TYPE.UINT8,
    broadcast: true
  },
  PRIVATE_MESSAGE: {
    kind: TYPE.UINT8,
    broadcast: false
  },
  HANDSHAKE: {
    kind: TYPE.UINT8,
    broadcast: false
  },
  NEARBY_PLAYERS: {
    kind: TYPE.UINT16,
    broadcast: false
  }
};

/**
 * @param {Array} data
 * @return {Buffer}
 */
export function encodePacket(data) {
  let type = PID[data[0]];
  let packet = PACKET[type];
  let array = null;
  let kind = packet.kind;
  switch (kind) {
    case TYPE.UINT8:
      array = new Uint8Array(data);
      return (array.buffer);
    break;
    case TYPE.UINT16:
      array = new Uint16Array(data);
      return (array.buffer);
    break;
    case TYPE.UINT32:
      array = new Uint32Array(data);
      return (array.buffer);
    break;
  };
}

/**
 * @param {Buffer} buffer
 * @return {Array*}
 */
export function decodePacket(buffer) {
  let type = PID[buffer[0] << 0];
  let kind = PACKET[type].kind;
  let decoded = null;
  switch (kind) {
    case TYPE.UINT8:
      decoded = new Uint8Array(buffer);
    break;
    case TYPE.UINT16:
      let bytes = Uint16Array.BYTES_PER_ELEMENT;
      let length = (buffer.length / bytes) << 0 || 1;
      decoded = new Uint16Array(length);
      for (let ii = 0; ii < length; ++ii) {
        decoded[ii] = buffer[ii * bytes];
      };
    break;
    case TYPE.UINT32:
      decoded = new Uint32Array(buffer);
    break;
  };
  return (decoded);
}

/**
 * @param {String} str
 * @return {Array}
 */
export function encodeString(str) {
  let out = str.split("");
  let data = [];
  let ii = 0;
  let length = str.length;
  for (; ii < length; ++ii) {
    data.push(str[ii].charCodeAt(0));
  };
  return (data);
}

/**
 * @param {Array} data
 * @return {String}
 */
export function decodeString(data) {
  let out = "";
  let ii = 0;
  let length = data.length;
  for (; ii < length; ++ii) {
    out += String.fromCharCode(data[ii]);
  };
  return (out);
}

/**
 * @param {Number} kind
 * @return {Object}
 */
export function getPacketByKind(kind) {
  return (PACKET[PID[kind]]);
}

/**
 * @param {DataView} view
 * @return {Boolean}
 */
export function isValidPacket(view) {
  return (PID[view.getUint8(0)] !== void 0);
}