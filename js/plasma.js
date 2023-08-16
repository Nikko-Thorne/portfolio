import * as THREE from "three";

const GlowShader = {
  uniforms: {
    c: { type: "f", value: 1.0 },
    p: { type: "f", value: 6.0 },
    glowColor: { type: "c", value: new THREE.Color(0xf3ffe2) },
  },
  vertexShader: [
    "uniform float c;",
    "uniform float p;",
    "varying vec3 vColor;",
    "void main() {",
    "     vec3 e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );",
    "     vec3 n = normalize( normalMatrix * normal );",
    "     vec4 newNormal = vec4( n * c, - c );",
    "     vColor = pow( abs(dot(newNormal, vec4( e, 0.0 ) ) ), p ) * vec3( glowColor );",
    "     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}",
  ].join("\n"),

  fragmentShader: [
    "uniform vec3 glowColor;",
    "varying vec3 vColor;",
    "void main() {",
    "     vec3 glow = vColor;",
    "     gl_FragColor = vec4( glow, 1.0 );",
    "}",
  ].join("\n"),
};
