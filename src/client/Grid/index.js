import {
  MapEntity
} from "../../shared/MapEntity";

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
    this.entities = instance.entities;
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

  /**
   * @param {MapEntity} entity
   * @return {Boolean}
   */
  entityCanMoveTo(entity) {
    if (!entity.isCollidable) return (true);
    let ii = 0;
    let length = this.entities.length;
    let tmp = null;
    for (; ii < length; ++ii) {
      tmp = this.entities[ii];
      // dont compare with ingoing entity
      if (entity.id === tmp.id) continue;
      if (tmp.isCollidable === false) continue;
      if (this.entitiesDoCollide(entity, tmp)) return (false);
    };
    return (true);
  }

  /**
   * @param {MapEntity} entityA
   * @param {MapEntity} entityB
   * @return {Boolean}
   */
  entitiesDoCollide(entityA, entityB) {
    // check if entity rectangles overlap
    if (this.entitiesOverlap(
      entityA.next.x, entityA.next.y,
      entityA.size.x, entityA.size.y,
      entityB.position.x, entityB.position.y,
      entityB.size.x, entityB.size.y
    )) return (this.intersectCollisionBoxes(entityA, entityB));
    return (false);
  }

  /**
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} w1
   * @param {Number} h1
   * @param {Number} x2
   * @param {Number} y2
   * @param {Number} w2
   * @param {Number} h2
   * @return {Boolean}
   */
  entitiesOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(
      x1 + w1 - 1 < x2 ||
      y1 + h1 - 1 < y2 ||
      x1 > x2 + w2 - 1 ||
      y1 > y2 + h2 - 1
    );
  }

  /**
   * @param {MapEntity} entityA
   * @param {MapEntity} entityB
   * @return {Boolean}
   */
  intersectCollisionBoxes(entityA, entityB) {

    let boxA = entityA.collisionBox;
    let boxB = entityB.collisionBox;

    let x1 = entityA.next.x;
    let y1 = entityA.next.y;
    let w1 = entityA.size.x;
    let h1 = entityA.size.y;

    let x2 = entityB.position.x;
    let y2 = entityB.position.y;
    let w2 = entityB.size.x;
    let h2 = entityB.size.y;

    let ii = 0;
    let length = boxA.length;

    for (; ii < length; ++ii) {
      if (boxA[ii] !== 1) continue;
      let yy = (h2 + y1 - y2) - 1;
      let xx = (w2 + x1 - x2) - 1;
      if (boxB[yy * xx] === 1) return (true);
    };

    return (false);

  }

}