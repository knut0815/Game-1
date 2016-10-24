/**
 * @class Grid
 */
export default class Grid {

  /**
   * @param {Instance} instance
   */
  constructor(instance) {
    this.width = 0;
    this.height = 0;
    this.factor = 1;
    this.array = [];
    this.instance = instance;
    this.resize(128, 64);
    this.setTile(2, 2, 1);
    this.getTile(2, 2);
  }

  /**
   * @param {Number} width
   * @param {Number} height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.resizeArray(width, height);
  }

  /**
   * @param {Number} width
   * @param {Number} height
   */
  resizeArray(width, height) {
    this.array = [];
    let ii = 0;
    let size = width * height;
    for (; ii < size; ++ii) {
      this.array[ii] = 0;
    };
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @return {Number}
   */
  getTileIndex(x, y) {
    return (((y--) * this.width) + (x--));
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} n
   */
  setTile(x, y, n) {
    let tile = this.getTileIndex(x, y);
    this.array[tile] = n;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @return {Number}
   */
  getTile(x, y) {
    let tile = this.getTileIndex(x, y);
    return (this.array[tile]);
  }

  /**
   * @param {Number} tile
   * @return {Boolean}
   */
  isCollisionTile(tile) {
    return (tile === 1);
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @return {Boolean}
   */
  isCollisionAt(x, y) {
    return (this.isCollisionTile(this.getTile(x, y)));
  }

}