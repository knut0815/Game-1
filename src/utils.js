let idx = 0;

/**
 * @return {Number}
 */
export function getUniqueHash() {
  if (++idx >= Number.MAX_SAFE_INTEGER) {
    idx = 0;
  }
  return (idx);
}

/**
 * @param {Object} cls
 * @param {Object} prot
 * @export
 */
export function inherit(cls, prot) {

  let key = null;

  for (key in prot) {
    if (prot[key] instanceof Function) {
      cls.prototype[key] = prot[key];
    }
  };

}

/**
 * @param {String} GET
 */
export function GET(url) {
	url = `${url}`;
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open("GET", url);
    req.onload = () => {
      if (req.status === 200) {
        resolve(req.response);
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = () => {
      reject(new Error("Network error"));
    };
    req.send();
  });
}

/**
 * @param {String} url
 * @return {Promise}
 */
export function getSprite(url) {

	let img = new Image();

	return new Promise((resolve) => {
		img.src = url;
		img.addEventListener("load", () => {
			resolve(img);
		});
	});

}

/**
 * @param {Image} img
 * @return {CanvasRenderingContext2D}
 */
export function img2canvas(img) {

	let canvas = document.createElement("canvas");
	let context = canvas.getContext("2d");

	canvas.width = img.width;
	canvas.height = img.height;

	context.imageSmoothing = false;
	context.drawImage(img, 0, 0, img.width, img.height);

	return (context);

}

/**
 * @return {WebGLRenderingContext}
 */
export function getWGLRenderingContext(canvas) {
  let options = {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
    stencil: false,
    preserveDrawingBuffer: false
  };
  return (
    canvas.getContext("webgl", options) ||
    canvas.getContext("experimental-webgl", options)
  );
}