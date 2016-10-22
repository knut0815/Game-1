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