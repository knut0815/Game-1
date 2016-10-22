import {
  encodePacket,
  decodePacket,
  isValidPacket,
  PID, TYPE, PACKET
} from "../../packet";

import {
  getUniqueHash,
  getWGLRenderingContext
} from "../../utils";

/**
 * @class
 */
export default class Renderer {

  /**
   * @constructor
   * @param {Client} instance
   */
  constructor(instance) {

    this.instance = instance;

    this.width = 0;
    this.height = 0;

    this.node = this.instance.node;

    this.gl = getWGLRenderingContext(this.node);

    window.addEventListener("resize", this::this.onResize);

    this.init();

  }

  init() {
    let gl = this.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, 
      new Float32Array([
        -1.0, -1.0, 
         1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0, 
         1.0, -1.0, 
         1.0,  1.0]), 
      gl.STATIC_DRAW
    );

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, 
      new Float32Array([
        -1.0, -1.0, 
         1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0, 
         1.0, -1.0, 
         1.0,  1.0]), 
      gl.STATIC_DRAW
    );
    this.compileShaders();
    this.onResize();
    this.draw();
  }

  compileShaders() {

    let gl = this.gl;

    var shaderSource;
    var vertexShader;
    var fragmentShader;

    shaderSource = ``;
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderSource);
    gl.compileShader(vertexShader);

    shaderSource   = ``;
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderSource);
    gl.compileShader(fragmentShader);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);  
    gl.useProgram(this.program);
  }

  clear() {
    let gl = this.gl;
    gl.clearColor(1, 0, 0, 0.5);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  draw() {
    this.clear();
    this.drawGrid();
    this.drawEntities();
    window.requestAnimationFrame(() => this.draw());
  }

  drawGrid() {
    let gl = this.gl;
    let pos = gl.getAttribLocation(this.program, "aVertexPosition");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  drawEntities() {

  }

  onResize() {
    let gl = this.gl;
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.width = width;
    this.height = height;
    this.node.width = width;
    this.node.height = height;
    gl.viewport(0, 0, width, height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

}