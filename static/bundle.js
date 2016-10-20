(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nodeModules = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var WS_PORT = exports.WS_PORT = 3000;
var HTTP_PORT = exports.HTTP_PORT = 8888;

var CLIENT_FPS = exports.CLIENT_FPS = 1e3 / 60;
var SERVER_FPS = exports.SERVER_FPS = 1e3 / 30;

var MAX_CONNECTIONS = exports.MAX_CONNECTIONS = 64;

var DEV_MODE = exports.DEV_MODE = true;

var PUBLIC_PATH = exports.PUBLIC_PATH = process.cwd() + "/static/";

var IS_SERVER = exports.IS_SERVER = !!(typeof window === "undefined");

}).call(this,require('_process'))
},{"_process":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Grid
 */
var Grid = function () {

	/**
  * @param {Instance} instance
  */
	function Grid(instance) {
		_classCallCheck(this, Grid);

		this.width = 0;
		this.height = 0;
		this.array = [];
		this.instance = instance;
		this.resize(8, 4);
		this.setTile(2, 2, 1);
		this.getTile(2, 2);
	}

	/**
  * @param {Number} width
  * @param {Number} height
  */


	_createClass(Grid, [{
		key: "resize",
		value: function resize(width, height) {
			this.width = width;
			this.height = height;
			this.resizeArray(width, height);
		}

		/**
   * @param {Number} width
   * @param {Number} height
   */

	}, {
		key: "resizeArray",
		value: function resizeArray(width, height) {
			this.array = [];
			var ii = 0;
			var size = width * height;
			for (; ii < size; ++ii) {
				this.array[ii] = 0;
			};
		}

		/**
   * @param {Number} x
   * @param {Number} y
   * @return {Number}
   */

	}, {
		key: "getTileIndex",
		value: function getTileIndex(x, y) {
			return y-- * this.width + x--;
		}

		/**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} n
   */

	}, {
		key: "setTile",
		value: function setTile(x, y, n) {
			var tile = this.getTileIndex(x, y);
			this.array[tile] = n;
		}

		/**
   * @param {Number} x
   * @param {Number} y
   * @return {Number}
   */

	}, {
		key: "getTile",
		value: function getTile(x, y) {
			var tile = this.getTileIndex(x, y);
			return this.array[tile];
		}

		/**
   * @param {Number} tile
   * @return {Boolean}
   */

	}, {
		key: "isCollisionTile",
		value: function isCollisionTile(tile) {
			return tile === 1;
		}

		/**
   * @param {Number} x
   * @param {Number} y
   * @return {Boolean}
   */

	}, {
		key: "isCollisionAt",
		value: function isCollisionAt(x, y) {
			return this.isCollisionTile(this.getTile(x, y));
		}
	}]);

	return Grid;
}();

exports.default = Grid;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cfg = require("../../cfg");

var _packet = require("../../packet");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 */
var Network = function () {

  /** @constructor */
  function Network() {
    _classCallCheck(this, Network);

    this.ws = null;
    this.connect();
  }

  /**
   * @return {String}
   */


  _createClass(Network, [{
    key: "getConnectionUrl",
    value: function getConnectionUrl() {
      var host = document.location.hostname;
      var protocol = location.protocol === "https:" ? protocol = "wss://" : "ws://";
      return "" + protocol + host + ":" + _cfg.WS_PORT;
    }
  }, {
    key: "connect",
    value: function connect() {
      var Socket = window.MozWebSocket || window.WebSocket;
      var url = this.getConnectionUrl();
      this.ws = new Socket(url);
      this.ws.binaryType = "arraybuffer";
      this.addEventListeners();
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      this.ws.addEventListener("open", this.onOpen.bind(this));
      this.ws.addEventListener("close", this.onClose.bind(this));
      this.ws.addEventListener("error", this.onError.bind(this));
      this.ws.addEventListener("message", this.onMessage.bind(this));
    }
  }, {
    key: "onOpen",
    value: function onOpen() {
      console.info("Opened WebSocket connection to " + this.getConnectionUrl());
      console.log("Sending handshake..");
      this.sendHandshake();
    }
  }, {
    key: "sendHandshake",
    value: function sendHandshake() {
      var data = [_packet.PID.HANDSHAKE, 0];
      var buffer = new Uint8Array(data).buffer;
      this.send(buffer);
    }
  }, {
    key: "getNearbyPlayers",
    value: function getNearbyPlayers() {
      var data = [_packet.PID.NEARBY_PLAYERS];
      var buffer = new Uint8Array(data).buffer;
      this.send(buffer);
    }
  }, {
    key: "onClose",
    value: function onClose() {
      console.error("Closed WebSocket connection to " + this.getConnectionUrl());
    }
  }, {
    key: "onError",
    value: function onError(e) {
      console.error(e);
    }
  }, {
    key: "onMessage",
    value: function onMessage(e) {
      var buffer = e.data;
      if (buffer instanceof ArrayBuffer && buffer.byteLength >= 1) {
        var view = new DataView(buffer);
        if ((0, _packet.isValidPacket)(view)) {
          this.processMessage(view);
        }
      }
    }

    /**
     * @param {DataView} view
     */

  }, {
    key: "processMessage",
    value: function processMessage(view) {
      var type = view.getUint8(0);
      var user = view.getUint8(1);
      switch (type) {
        case _packet.PID.HANDSHAKE:
          console.log("Received handshake!");
          console.log("Client id is " + user);
          this.getNearbyPlayers();
          break;
        case _packet.PID.JOIN:
          console.log(user + " joined");
          break;
        case _packet.PID.EXIT:
          console.log(user + " left");
          break;
        case _packet.PID.JUMP:
          console.log(user + " jumped!");
          break;
        case _packet.PID.MOVE:
          var key = view.getUint8(2);
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
        case _packet.PID.NEARBY_PLAYERS:
          var ii = 1;
          var length = view.byteLength;
          for (; ii < length; ++ii) {
            console.log(view.getUint8(ii));
          };
          break;
      };
    }

    /**
     * @param {Buffer} buffer
     */

  }, {
    key: "send",
    value: function send(buffer) {
      this.ws.send(buffer);
    }
  }]);

  return Network;
}();

exports.default = Network;

},{"../../cfg":2,"../../packet":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Grid = require("./Grid");

var _Grid2 = _interopRequireDefault(_Grid);

var _Network = require("./Network");

var _Network2 = _interopRequireDefault(_Network);

var _packet = require("../packet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ws support
if (window.WebSocket === void 0) throw new Error("Your browser doesnt support WebSockets");

/**
 * @class
 */

var Client =

/** @constructor */
function Client() {
  _classCallCheck(this, Client);

  this.grid = new _Grid2.default(this);
  //this.local = new MapEntity(this);
  this.network = new _Network2.default(this);
};

exports.default = Client;


var client = new Client();

window.addEventListener("keydown", function (e) {

  switch (e.keyCode) {
    case 32:
      client.network.send(new Uint8Array([_packet.PID.JUMP]).buffer);
      break;
    case 37:
    case 39:
    case 38:
    case 40:
      client.network.send(new Uint8Array([_packet.PID.MOVE, e.keyCode]).buffer);
      break;
  };
});

window.addEventListener("blur", function (e) {
  console.log("Window blurred!");
});

},{"../packet":6,"./Grid":3,"./Network":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodePacket = encodePacket;
exports.getPacketByKind = getPacketByKind;
exports.isValidPacket = isValidPacket;
var idx = 0;

var PID = exports.PID = {};
PID[PID["JOIN"] = idx++] = "JOIN";
PID[PID["EXIT"] = idx++] = "EXIT";
PID[PID["MOVE"] = idx++] = "MOVE";
PID[PID["JUMP"] = idx++] = "JUMP";
PID[PID["HANDSHAKE"] = idx++] = "HANDSHAKE";
PID[PID["NEARBY_PLAYERS"] = idx++] = "NEARBY_PLAYERS";

var TYPE = exports.TYPE = {};
TYPE[TYPE["INT8"] = idx++] = "INT8";
TYPE[TYPE["INT16"] = idx++] = "INT16";
TYPE[TYPE["INT32"] = idx++] = "INT32";
TYPE[TYPE["UINT8"] = idx++] = "UINT8";
TYPE[TYPE["UINT16"] = idx++] = "UINT16";
TYPE[TYPE["UINT32"] = idx++] = "UINT32";
TYPE[TYPE["FLOAT32"] = idx++] = "FLOAT32";
TYPE[TYPE["FLOAT64"] = idx++] = "FLOAT64";

var PACKET = exports.PACKET = {
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
function encodePacket(data) {
  var type = PID[data.shift()];
  var packet = PACKET[type];
  var kind = packet.kind;
  switch (kind) {
    case TYPE.UINT8:
      array = new Uint8Array(data);
      return array.buffer;
      break;
    case TYPE.UINT16:
      array = new Uint16Array(data);
      return array.buffer;
      break;
  };
}

/**
 * @param {Number} kind
 * @return {Object}
 */
function getPacketByKind(kind) {
  return PACKET[PID[kind]];
}

/**
 * @param {DataView} view
 * @return {Boolean}
 */
function isValidPacket(view) {
  return PID[view.getUint8(0)] !== void 0;
}

},{}]},{},[5])(5)
});