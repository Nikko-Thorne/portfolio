"use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  const vs = `
    // an attribute will receive data from a buffer
    attribute vec4 a_position;

    // all shaders have a main function
    void main() {

      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      gl_Position = a_position;
    }
  `;

  const fs = `
    precision highp float;

    uniform sampler2D iChannel0;
    uniform vec2 iResolution;
    uniform vec2 iMouse;
    uniform float iTime;


    // 0 to disable mouse interaction
    #define ENABLE_MOUSE 1
    
    //looks best with around 25 rays
    #define NUM_RAYS 12.
    
    #define VOLUMETRIC_STEPS 19
    
    #define MAX_ITER 35
    #define FAR 6.
    
    #define time iTime*1.1
    
    
    mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}
    float noise( in vec2 x ){return texture2D(iChannel0, x).x;}
    
    float hash( float n ){return fract(sin(n)*43758.5453);}
    
    float noise(in vec2 p)
    {
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        fp = fp*fp*(3.0-2.0*fp);
        
        vec2 tap = (ip.xy+vec2(37.0,17.0)*ip.z) + fp.xy;
        vec2 rg = texture2D( iChannel0, (tap + 0.5)/256.0, 0.0 ).yx;
        return mix(rg.x, rg.y, fp.z);
    }
    
    mat3 m3 = mat3( 0.00,  0.80,  0.60,
                  -0.80,  0.36, -0.48,
                  -0.60, -0.48,  0.64 );
    
    
    //See: https://www.shadertoy.com/view/XdfXRj
    float flow(in vec3 p, in float t)
    {
        float z=2.;
        float rz = 0.;
        vec3 bp = p;
        for (float i= 1.;i < 5.;i++ )
        {
            p += time*.1;
            rz+= (sin(noise(p+t*0.8)*6.)*0.5+0.5) /z;
            p = mix(bp,p,0.6);
            z *= 2.;
            p *= 2.01;
            p*= m3;
        }
        return rz;	
    }
    
    //could be improved
    float sins(in float x)
    {
         float rz = 0.;
        float z = 2.;
        for (float i= 0.;i < 3.;i++ )
        {
            rz += abs(fract(x*1.4)-0.5)/z;
            x *= 1.3;
            z *= 1.15;
            x -= time*.65*z;
        }
        return rz;
    }
    
    float segm( vec3 p, vec3 a, vec3 b)
    {
        vec3 pa = p - a;
        vec3 ba = b - a;
        float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1. );	
        return length( pa - ba*h )*.5;
    }
    
    vec3 path(in float i, in float d, vec3 hit)
    {
        vec3 en = vec3(0.,0.,1.);
        float sns2 = sins(d+i*0.5)*0.22;
        float sns = sins(d+i*.6)*0.21;
        
        if (dot(hit,hit)>0.) { 
            // mouse interaction
            hit.xz *= mm2(sns2*.5);
            hit.xy *= mm2(sns*.3);
            return hit;
        }
    
        en.xz *= mm2((hash(i*10.569)-.5)*6.2+sns2);
        en.xy *= mm2((hash(i*4.732)-.5)*6.2+sns);
        
        return en;
    }
    
    vec2 map(vec3 p, float i, vec3 hit)
    {
        vec3 p0 = p;
        float lp = length(p);
        vec3 bg = vec3(0.);   
        vec3 en = path(i,lp, hit);
        
        float ins = smoothstep(0.11,.46,lp);
        float outs = .15+smoothstep(.0,.15,abs(lp-1.));
        p *= ins*outs;
        float id = ins*outs;
        
        float rz = segm(p, bg, en)-0.011;
        
        return vec2(rz,id);
    }
    
    float march(in vec3 ro, in vec3 rd, in float startf, in float maxd, in float j, vec3 hit)
    {
        float precis = 0.001;
        float h=0.5;
        float d = startf;
        for( int i=0; i<MAX_ITER; i++ )
        {
            if( abs(h)<precis||d>maxd ) break;
            d += h*1.2;
            float res = map(ro+rd*d, j, hit).x;
            h = res;
        }
        return d;
    }
    
    //volumetric marching
    vec3 vmarch(in vec3 ro, in vec3 rd, in float j, in vec3 orig, vec3 hit)
    {   
        vec3 p = ro;
        vec2 r = vec2(0.);
        vec3 sum = vec3(0);
        float w = 0.;
        for( int i=0; i<VOLUMETRIC_STEPS; i++ )
        {
            r = map(p,j,hit);
            p += rd*.03;
            float lp = length(p);
            
            vec3 col = sin(vec3(1.05,2.5,1.52)*3.94+r.y)*.85+0.4;
            col.rgb *= smoothstep(.0,.015,-r.x);
            col *= smoothstep(0.04,.2,abs(lp-1.1));
            col *= smoothstep(0.1,.34,lp);
            sum += abs(col)*5. * (1.2-noise(lp*2.+j*13.+time*5.)*1.1) / (log(distance(p,orig)-2.)+.75);
        }
        return sum;
    }
    
    //returns both collision dists of unit sphere
    vec2 iSphere2(in vec3 ro, in vec3 rd)
    {
        vec3 oc = ro;
        float b = dot(oc, rd);
        float c = dot(oc,oc) - 1.;
        float h = b*b - c;
        if(h <0.0) return vec2(-1.);
        else return vec2((-b - sqrt(h)), (-b + sqrt(h)));
    }
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {	
        vec2 p = fragCoord.xy/iResolution.xy-0.5;
        p.x*=iResolution.x/iResolution.y;
        vec2 um = iMouse.xy / iResolution.xy-.5;
        um.x*=iResolution.x/iResolution.y;
        
        //camera
        vec3 ro = vec3(0.,0.,5.);
        vec3 rd = normalize(vec3(p*.7,-1.5));
        
        mat2 mx = mm2(time*.4);
        mat2 my = mm2(time*0.3); 
        ro.xz *= mx;rd.xz *= mx;
        ro.xy *= my;rd.xy *= my;
           
        vec3 bro = ro;
        vec3 brd = rd;
    
        vec3 col = vec3(0.0125,0.,0.025);
        #if 1
        for (float j = 1.;j<NUM_RAYS+1.;j++)
        {
            ro = bro;
            rd = brd;
            mat2 mm = mm2((time*0.1+((j+1.)*5.1))*j*0.25);
    
            float rz = march(ro,rd,2.5,FAR,j, vec3(0.));
            if ( rz >= FAR)continue;
            vec3 pos = ro+rz*rd;
            col = max(col,vmarch(pos,rd,j, bro, vec3(0.)));
        }
        #endif
        
        
        #if ENABLE_MOUSE 
        // Mouse interaction
        vec3 hit = vec3(0.);
        vec3 rdm = normalize(vec3(um*.7, -1.5));
        rdm.xz *= mx;
        rdm.xy *= my;
        
        // Compute intersection point between the surface of the sphere
        // and the ray casted by the mouse
        if (iMouse.z > 0.) {
            vec2 res = iSphere2(bro, rdm);
            if (res.x > 0.) hit = bro + res.x * rdm;
        }
        
        // Cast a final ray for the light path of the mouse
        if (dot(hit, hit) != 0.)
        {
            float j = NUM_RAYS+1.;
            ro = bro;
            rd = brd;
            mat2 mm = mm2((time*0.1+((j+1.)*5.1))*j*0.25);
            
            float rz = march(ro,rd,2.5,FAR,j, hit);
            if ( rz < FAR) {
                vec3 pos = ro+rz*rd;
                col = max(col,vmarch(pos,rd,j, bro, hit));
            }
        }
        #endif
        
        ro = bro;
        rd = brd;
        vec2 sph = iSphere2(ro,rd);
        
        if (sph.x > 0.)
        {
            vec3 pos = ro+rd*sph.x;
            vec3 pos2 = ro+rd*sph.y;
            vec3 rf = reflect( rd, pos );
            vec3 rf2 = reflect( rd, pos2 );
            float nz = (-log(abs(flow(rf*1.2,time)-.01)));
            float nz2 = (-log(abs(flow(rf2*1.2,-time)-.01)));
            col += (0.1*nz*nz* vec3(0.12,0.12,.5) + 0.05*nz2*nz2*vec3(0.55,0.2,.55))*0.8;
        }
        
        fragColor = vec4(col*1.3, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  // setup GLSL program
  const program = webglUtils.createProgramFromSources(gl, [vs, fs]);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // look up uniform locations
  const resolutionLocation = gl.getUniformLocation(program, "iResolution");
  const mouseLocation = gl.getUniformLocation(program, "iMouse");
  const timeLocation = gl.getUniformLocation(program, "iTime");

  // Create a buffer to put three 2d clip space points in
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // fill it with a 2 triangles that cover clipspace
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1,
      -1, // first triangle
      1,
      -1,
      -1,
      1,
      -1,
      1, // second triangle
      1,
      -1,
      1,
      1,
    ]),
    gl.STATIC_DRAW
  );

  const playpauseElem = document.querySelector(".playpause");
  const inputElem = document.querySelector(".divcanvas");
  inputElem.addEventListener("mouseover", requestFrame);
  inputElem.addEventListener("mouseout", cancelFrame);

  let mouseX = 0;
  let mouseY = 0;

  function setMousePosition(e) {
    const rect = inputElem.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = rect.height - (e.clientY - rect.top) - 1; // bottom is 0 in WebGL
  }

  inputElem.addEventListener("mousemove", setMousePosition);
  inputElem.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      playpauseElem.classList.add("playpausehide");
      requestFrame();
    },
    { passive: false }
  );
  inputElem.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      setMousePosition(e.touches[0]);
    },
    { passive: false }
  );
  inputElem.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      playpauseElem.classList.remove("playpausehide");
      cancelFrame();
    },
    { passive: false }
  );

  let requestId;
  function requestFrame() {
    if (!requestId) {
      requestId = requestAnimationFrame(render);
    }
  }
  function cancelFrame() {
    if (requestId) {
      cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  }

  let then = 0;
  let time = 0;
  function render(now) {
    requestId = undefined;
    now *= 0.001; // convert to seconds
    const elapsedTime = Math.min(now - then, 0.1);
    time += elapsedTime;
    then = now;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(
      positionAttributeLocation,
      2, // 2 components per iteration
      gl.FLOAT, // the data is 32bit floats
      false, // don't normalize the data
      0, // 0 = move forward size * sizeof(type) each iteration to get the next position
      0 // start at the beginning of the buffer
    );

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(mouseLocation, mouseX, mouseY);
    gl.uniform1f(timeLocation, time);

    gl.drawArrays(
      gl.TRIANGLES,
      0, // offset
      6 // num vertices to process
    );

    requestFrame();
  }

  requestFrame();
  requestAnimationFrame(cancelFrame);
}

main();