import {
	getSprite,
	img2canvas
} from "../../utils";

/**
 * @class
 */
export default class TextureEntity {

	/**
	 * @param {String} url
	 * @constructor
	 */
	constructor(url) {
		this.url = url;
		this.isLoaded = false;
		this.buffer = null;
		this.width = 0;
		this.height = 0;
		this.loadTexture(url).then((data) => {
			this.buffer = img2canvas(data);
			this.width = this.buffer.canvas.width;
			this.height = this.buffer.canvas.height;
			this.isLoaded = true;
		});
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