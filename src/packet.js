let idx = 0;

export const PID = {};
PID[PID["JOIN"] = idx++] = "JOIN";
PID[PID["EXIT"] = idx++] = "EXIT";
PID[PID["MOVE"] = idx++] = "MOVE";
PID[PID["JUMP"] = idx++] = "JUMP";
PID[PID["HANDSHAKE"] = idx++] = "HANDSHAKE";
PID[PID["NEARBY_PLAYERS"] = idx++] = "NEARBY_PLAYERS";

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
  let type = PID[data.shift()];
  let packet = PACKET[type];
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
  };
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