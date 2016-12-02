import {
	getSprite,
	img2canvas,
	createCanvas
} from "../../utils";

import ShadowEntity from "../ShadowEntity";

/**
 * @class
 */
export default class TextureEntity {

	/**
	 * @param {String} url
	 * @param {Point} size
	 * @constructor
	 */
	constructor(url, size) {
		this.url = url;
		this.buffer = null;
		this.shadow = null;
		this.width = 0;
		this.height = 0;
		this.size = size;
		this.sprites = [];
		this.isLoaded = false;
		this.loadTexture(url).then((data) => {
			this.buffer = img2canvas(data);
			this.width = this.buffer.canvas.width;
			this.height = this.buffer.canvas.height;
			this.generateSprites();
			this.isLoaded = true;
			this.shadow = new ShadowEntity(this);
		});
	}

	generateSprites() {

    let xx = 0;
    let yy = 0;

    let width  = this.width / (this.size.x * 2);
    let height = this.height / (this.size.y * 2);

    let buffer = null;

    for (; yy < height;) {
      for (xx = 0; xx < width; ++xx) {
        if (xx === 0) ++yy;
        buffer = createCanvas(this.size.x * 2, this.size.y * 2);
        buffer.drawImage(
          this.buffer.canvas,
          (this.size.x * 2) * xx, (this.size.y * 2) * (yy - 1),
          this.width, this.height,
          0, 0,
          this.width, this.height
        );
        this.sprites.push(buffer);
        buffer = null;
      };
    };

	}

	/**
	 * @param {String} url
	 * @return {Promise}
	 */
	loadTexture(url) {
		return new Promise((resolve) => {
			getSprite(url).then((data) => {
				resolve(data);
			});
		});
	}

}