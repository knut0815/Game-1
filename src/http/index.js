import fs from "fs";
import url from "url";
import path from "path";
import http from "http";
import browserify from "browserify";

import {
  DEV_MODE,
  HTTP_PORT,
  PUBLIC_PATH
} from "../cfg";

/**
 * @class
 */
export default class HTTPServer {

  /**
   * @constructor
   */
  constructor() {

    this.cache = {};

    this.http = null;
    this.response = null;

    this.listen();

  }

  listen() {
    this.http = http.createServer((req, res) => {
      this.response = res;
      this.onRequest(req);
    }).listen(HTTP_PORT);
  }

  /**
   * @return {Boolean}
   */
  isCached(id) {
    return (this.cache[id] !== void 0);
  }

  /**
   * @param {String} path
   * @return {Boolean}
   */
  fileDoesExist(path) {
    try {
      fs.accessSync(PUBLIC_PATH + path, fs.F_OK);
    } catch (e) {
      return (false);
    }
    return (true);
  }

  /**
   * @param {String} id
   * @return {Boolean}
   */
  writeIntoCache(id) {
    let path = id + ".html";
    let buffer = null;
    let doesExist = this.fileDoesExist(path);
    if (doesExist) {
      buffer = fs.readFileSync(PUBLIC_PATH + path, "binary");
      this.cache[id] = buffer;
      return (true);
    }
    return (false);
  }

  /**
   * @return {Object}
   */
  getFromCache(id) {
    return (this.cache[id]);
  }

  /**
   * @param {ClientRequest} req
   * @return {String}
   */
  getPath(req) {
    let query = url.parse(req.url, true, false);
    return (query.path);
  }

  /**
   * @param {ClientRequest} req
   */
  onRequest(req) {
    this.routeRequest(req);
  }

  /**
   * @param {Buffer} buffer
   */
  send(buffer) {
    this.response.end(buffer);
  }

  /**
   * @param {String} path
   */
  sendView(path) {
    if (!this.isCached(path)) {
      if (!this.writeIntoCache(path)) {
        // better dont delete this file lul
        this.sendView("404");
        return void 0;
      }
    }
    this.send(this.getFromCache(path));
  }

  /**
   * @param {String} path
   */
  getFileExtension(path) {
    return (path.slice((path.lastIndexOf(".") - 1 >>> 0) + 2));
  }

  send404() {
    let res = this.response;
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("404 Not found");
    res.end();
  }

  /**
   * @param {ClientRequest} req
   */
  routeRequest(req) {
    let path = this.getPath(req);
    let fileExt = this.getFileExtension(path);
    let isFile = fileExt.length > 0;
    if (isFile) {
      if (this.fileDoesExist(path)) {
        this.send(fs.readFileSync(PUBLIC_PATH + path));
      } else {
        this.send404();
      }
      return void 0;
    }
    switch (path) {
      default:
      case "/":
      case "index":
        // TODO: refresh game client bundle before answering
        this.transform("src/client/index.js", PUBLIC_PATH + "bundle.js").then(() => {
          this.sendView("index");
        });
      break;
      case "/login":
        this.sendView("login");
      break;
      case "/register":
        this.sendView("register");
      break;
    };
  }

  /**
   * @param {String} loc
   * @param {String} path
   */
  transform(loc, path) {
    return new Promise((resolve) => {
      let stream = fs.createWriteStream(path);
      browserify({
        standalone: "nodeModules",
        transform: "babelify"
      }).add(loc).bundle().pipe(stream);
      stream.on("finish", resolve)
    });
  }

}