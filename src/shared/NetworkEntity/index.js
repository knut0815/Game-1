import {
	IS_SERVER,
	getPacketByKind
} from "../../cfg";

/**
 * @class
 */
export default class NetworkEntity {

	/**
	 * @param {} socket
	 * @param {} instance
	 * @constructor
	 */
	constructor(socket, instance) {
		this.uid = 0;
		this.socket = socket;
		this.instance = instance;
	}

	/**
	 * @param {Buffer} buffer
	 */
	send(buffer) {
		if (IS_SERVER && this.isBroadcastPacsket(view)) {
			this.broadcast(view);
		} else {
			this.socket.send();
		}
	}

	broadcast(buffer) {
		if (!IS_SERVER) {
			throw new Error(`Broadcast triggered on client!`);
		}
		if (IS_SERVER) {
			let ii = 0;
	    let users = this.instance.users;
	    for (; ii < users.length; ++ii) {
	      if (users[ii].uid !== this.uid) {
	        users[ii].send(buffer);
	      }
	    };
		} else {
			this.socket.send(buffer);
		}
	}

	onClose() {

	}

	onMessage(buffer) {
		if (buffer instanceof Buffer && buffer.length >= 1) {
      let view = new DataView(new Uint8Array(buffer).buffer);
      if (isValidPacket(view)) {
        this.routeMessage(view);
      }
    }
	}

	routeMessage(view) {
		let kind = view.getUint8(0);
		let packet = getPacketByKind(kind);
		console.log(packet);
	}

}