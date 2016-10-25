import {
	IS_CLIENT
} from "./cfg";

import {
	encodeString
} from "./packet";

/**
 * @param {String} str
 */
Array.prototype.pushString = function(str) {
  let data = encodeString(str);
  let ii = 0;
  let length = data.length;
  for (; ii < length; ++ii) {
    this.push(data[ii]);
  };
  return void 0;
}

if (IS_CLIENT) {
	Object.defineProperty(CanvasRenderingContext2D.prototype, "imageSmoothing", {
		set: function(truth) {
			this.imageSmoothingEnabled = truth;
		  this.oImageSmoothingEnabled = truth;
		  this.msImageSmoothingEnabled = truth;
		  this.mozImageSmoothingEnabled = truth;
		  this.webkitImageSmoothingEnabled = truth;
		},
		enumerable: true,
	  configurable: true
	});
}