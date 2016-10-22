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