// PROTOTYPE - NOT FOR PRODUCTION
// Cel + ink shaders for skinned cats. Colours are handled as raw sRGB (no colour-space chunk, no
// tone mapping), so kit hexes arrive on screen unchanged (art bible §4: ΔE ≤ 2).
const VARY = /* glsl */`
  varying vec3 vRest; varying vec3 vRestN; varying vec3 vWN; varying float vPart; varying vec3 vAux;
`;
export const fillVert = /* glsl */`
  #include <common>
  #include <skinning_pars_vertex>
  attribute float part; attribute vec3 aux;
  ${VARY}
  void main() {
    #include <skinbase_vertex>
    #include <beginnormal_vertex>
    #include <skinnormal_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>
    vRest = position; vRestN = normal; vPart = part; vAux = aux;
    vWN = normalize(mat3(modelMatrix) * objectNormal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }`;

export function fillFrag(coatGlsl, colorNames) {
  return /* glsl */`
  ${VARY}
  uniform vec3 uKeyDir; uniform vec3 uLitMul; uniform vec3 uShadeMul; uniform float uTerm;
  uniform vec3 uHeadC; uniform float uSpineY; uniform vec3 uCollarC; uniform vec3 uCollarAx; uniform vec3 uEar; uniform vec4 uChin;
  uniform sampler2D uFace; uniform vec4 uFaceRect; uniform float uFaceFrame; uniform float uFaceFrames; uniform float uFaceOn;
  uniform float uSil; uniform vec3 uSilCol;
  ${colorNames.map((n) => `uniform vec3 c_${n};`).join('\n')}
  ${coatGlsl}
  void main() {
    if (uSil > 0.5) { gl_FragColor = vec4(uSilCol, 1.0); return; }
    vec3 base = coat();
    // two tones, hard terminator (antialiased over one pixel)
    float ndl = dot(normalize(vWN), uKeyDir);
    float aa = max(fwidth(ndl) * 0.75, 1e-4);
    float sh = 1.0 - smoothstep(uTerm - aa, uTerm + aa, ndl);
    // authored contact shade: the head's shadow on the chest/shoulders (kit: shade ellipse under the head)
    if (vPart < 0.5) { vec3 d = (vRest - uChin.xyz) / vec3(uChin.w * 1.25, uChin.w * 0.7, uChin.w); if (dot(d, d) < 1.0) sh = 1.0; }
    vec3 col = base * mix(uLitMul, uShadeMul, sh);
    // face decal (projected along head +Z in rest space; flat, never shaded)
    if (uFaceOn > 0.5 && vPart > 0.5 && vPart < 1.5 && vRestN.z > 0.05) {
      vec2 uv = (vRest.xy - uFaceRect.xy) / (2.0 * uFaceRect.zw) + 0.5;
      if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0 && vRest.z > uHeadC.z) {
        vec4 f = texture2D(uFace, vec2(uv.x, (uFaceFrames - 1.0 - uFaceFrame + uv.y) / uFaceFrames));
        col = mix(col, f.rgb, f.a);
      }
    }
    gl_FragColor = vec4(col, 1.0);
  }`;
}

// Inverted hull: back faces pushed out along the smoothed (gradient) normal in CLIP space, so the
// line is uLinePx render-target pixels wide at any distance (L-3, L-4).
export const hullVert = /* glsl */`
  #include <common>
  #include <skinning_pars_vertex>
  uniform vec2 uRes; uniform float uLinePx; uniform float uPartLine[5];
  attribute float part;
  void main() {
    #include <skinbase_vertex>
    #include <beginnormal_vertex>
    #include <skinnormal_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    vec3 vn = normalize(normalMatrix * objectNormal);
    vec2 sd = (projectionMatrix * vec4(vn, 0.0)).xy * uRes;
    float l = length(sd);
    sd = l > 1e-6 ? sd / l : vec2(0.0);
    float w = uLinePx * uPartLine[int(part + 0.5)];
    clip.xy += sd * (w * 2.0 / uRes) * clip.w;
    clip.z += 0.00002 * clip.w; // a hair behind: keeps the hull off the fill at grazing creases
    gl_Position = clip;
  }`;
export const hullFrag = /* glsl */`
  uniform vec3 uInk;
  void main() { gl_FragColor = vec4(uInk, 1.0); }`;

// Soft contact blob (E-4): feathered Shadow Wisteria ellipse at 45%.
export const blobVert = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
export const blobFrag = /* glsl */`
  uniform vec3 uCol; uniform float uAlpha; varying vec2 vUv;
  void main() { float r = length(vUv); float a = uAlpha * (1.0 - smoothstep(0.45, 1.0, r)); if (a < 0.003) discard; gl_FragColor = vec4(uCol, a); }`;
