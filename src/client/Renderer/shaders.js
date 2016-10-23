export const SPRITE_VERTEX = `
  precision lowp float;

  uniform vec2 uScale;
  uniform vec2 uEntityScale;
  attribute vec2 aObjCen;
  attribute float aObjRot;
  attribute float aIdx;
  varying vec2 uv;

  void main(void) {
    if (aIdx == 0.0) {
      uv = vec2(0.0,0.0);
    } else if (aIdx == 1.0) {
      uv = vec2(1.0,0.0);
    } else if (aIdx == 2.0) {
      uv = vec2(0.0,1.0);
    } else {
      uv = vec2(1.0,1.0);
    }
    vec2 pos = vec2(
      aObjCen.x + sin(aObjRot)*uEntityScale.y*(-0.5 + uv.y)
      + cos(aObjRot)*uEntityScale.x*(-0.5 + uv.x),
      aObjCen.y + cos(aObjRot)*uEntityScale.y*(-0.5 + uv.y)
      - sin(aObjRot)*uEntityScale.x*(-0.5 + uv.x)
    );
    gl_Position = vec4(
      -1.0 + 2.0*pos.x/uScale.x,
      1.0 - 2.0*pos.y/uScale.y,
      0.0, 1.0
    );
  }
`;

export const SPRITE_FRAGMENT = `
  precision lowp float;

  uniform sampler2D u_texture0;
  varying vec2 uv;

  void main(void) {
    gl_FragColor = texture2D(u_texture0, uv);
    if (gl_FragColor.a < 0.5) discard;
  }
`;

export const GRID_VERTEX = `
  attribute vec4 aVertexPosition;

  void main(void) {
    gl_Position = aVertexPosition;
  }
`;

export const GRID_FRAGMENT = `
  precision mediump float;

  uniform float vpw; // Width, in pixels
  uniform float vph; // Height, in pixels

  uniform vec2 offset;
  uniform vec2 pitch;

  void main() {
    float lX = gl_FragCoord.x / vpw;
    float lY = gl_FragCoord.y / vph;

    float scaleFactor = 10000.0;

    float offX = (scaleFactor * offset[0]) + gl_FragCoord.x;
    float offY = (scaleFactor * offset[1]) + (1.0 - gl_FragCoord.y);

    if (int(mod(offX, pitch[0])) == 0 ||
        int(mod(offY, pitch[1])) == 0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5);
    } else {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  }
`;