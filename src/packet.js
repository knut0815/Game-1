let idx = 0;

export const PID = {};
PID[PID["JOIN"] = idx++] = "JOIN";
PID[PID["EXIT"] = idx++] = "EXIT";
PID[PID["MOVE"] = idx++] = "MOVE";
PID[PID["JUMP"] = idx++] = "JUMP";
PID[PID["FACE"] = idx++] = "FACE";
PID[PID["HANDSHAKE"] = idx++] = "HANDSHAKE";

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
  HS: {
    id: PID.HS,
    type: TYPE.UINT8
  },
  JOIN: {
    id: PID.JOIN,
    type: TYPE.UINT8
  },
  EXIT: {
    id: PID.EXIT,
    type: TYPE.UINT8
  },
  MOVE: {
    id: PID.MOVE,
    type: TYPE.UINT16
  },
  JUMP: {
    id: PID.JUMP,
    type: TYPE.UINT8
  },
  FACE: {
    id: PID.FACE,
    type: TYPE.UINT8
  }
};

/**
 * @param {DataView} view
 * @return {Boolean}
 */
export function isValidPacket(view) {
  return (PID[view.getUint8(0)] !== void 0);
}