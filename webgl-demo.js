var rotation_x = 0.0;
var rotation_y = 0.0;
var rotation_z = 0.0;
var to_shade = 0;
var positions = [];
var indices = [];
var translation_x = 0.0;
var translation_y = 0.0;
var zooming = 0.0;
var to_wireframe = false;
var gl = {};
var data = {};
var programInfo = {};
var vertexCount = 0;
var normals = [];
var to_meshEdges = false;
var average_normals = [];
var to_smooth = 0;
//Function demonstrating how to load a sample file from the internet.

class Edge{
  constructor(vert_origin, vert_dest, face_right){
    this.vert_origin = vert_origin;
    this.vert_dest = vert_dest;
    this.face_left = {};
    this.face_right = {};
    this.edge_left_cw = {};
    this.edge_left_ccw = {};
    this.edge_right_cw = {};
    this.edge_right_ccw = {};

  }
}

class Face{
  constructor(edge){
    this.edge = edge;
    this.normal = {};
    }
}

class Vertex{
  constructor(x,y,z){
    this.edge = {};
    this.x = x;
    this.y = y;
    this.z = z;
    
  }
}

class WindgedEdge{

  constructor(){
  this.faces = [];
  this.vertices = [];
  this.edges = [];
  }
}




function createWingedEdge(positions,indices){

windgedEdge = new WindgedEdge;
normal_list = [];
normalsmooth = [];
for (var i = 0; i < positions.length; i+=1) {
  vertex = new Vertex(positions[i][0], positions[i][1], positions[i][2]);
  windgedEdge.vertices.push(vertex);
}

for (var i = 0; i < indices.length; i+=3) {
  edge_a = createEdge(indices[i], indices[i+1]);
  edge_b = createEdge(indices[i+1], indices[i+2]);
  edge_c = createEdge(indices[i+2], indices[i]);

  face = new Face(edge_a);
  windgedEdge.faces.push(face);


  edge_a.face_right = face;
  edge_b.face_right = face;
  edge_c.face_right = face;

  edge_a.edge_right_cw = edge_b;
  edge_a.edge_right_ccw = edge_c;

  edge_b.edge_right_cw = edge_c;
  edge_b.edge_right_ccw = edge_a;

  edge_c.edge_right_cw = edge_c;
  edge_c.edge_right_ccw = edge_b;

  addLeft(edge_a);
  addLeft(edge_b);
  addLeft(edge_c);

  vertex_1 = windgedEdge.vertices[indices[i]];
  vertex_2 = windgedEdge.vertices[indices[i+1]];
  vertex_3 = windgedEdge.vertices[indices[i+2]];
  vertex_1.edge = edge_a;
  vertex_2.edge = edge_b;
  vertex_3.edge = edge_c;
  // WingedEdgetoObject(windgedEdge);

}
  



function addLeft(edge){
  origin_position = edge.vert_origin;
  destination_position = edge.vert_dest;
  for (var i = 0; i < windgedEdge.edges.length; i++) {
    if (windgedEdge.edges[i].vert_origin == destination_position && windgedEdge.edges[i].vert_dest == origin_position){
      edge_opposite = windgedEdge.edges[i];
      edge.face_left = edge_opposite.face_right;
      edge.edge_left_cw = edge_opposite.edge_right_ccw;
      edge.edge_left_ccw = edge_opposite.edge_right_cw;

      edge_opposite.face_left = edge.face_right;
      edge_opposite.edge_left_cw = edge.edge_right_ccw;
      edge_opposite.edge_left_ccw = edge.edge_right_cw;
      break;
    }
  }

  return edge;
}

function createEdge(index_1, index_2) {
  origin_position = positions[index_1];
  destination_position = positions[index_2];
  edge = new Edge(origin_position, destination_position);
  windgedEdge.edges.push(edge);
  return edge;
}
// console.log(windgedEdge);
var values = renderWindgedEdge(windgedEdge);
var indices = values['indices'];
var positions = values['positions'];
// console.log(values);
// console.log(positions)
makeNormals(positions, windgedEdge);
}

function renderWindgedEdge(windgedEdge){
  var positions = [];
  var normal_per_vertex = [];
  var indices = [];
  for (var i = 0; i < windgedEdge.vertices.length; i++) {
    positions.push([windgedEdge.vertices[i].x, windgedEdge.vertices[i].y, windgedEdge.vertices[i].z]);
  }
  for (var i=0; i<positions.length;i++)
    indices.push([vertex_1,vertex_2,vertex_3]);

  // console.log(positions)
  return{
    indices, positions
  };

}
function makeNormals(positions, windgedEdge){
  var normal_per_vertex = [];
  for (var i=0; i<positions.length;i++)
    normal_per_vertex[i]=[];
  // console.log(normal_per_vertex);
  // console.log(windgedEdge.faces.length)
  for (var j = 0; j < windgedEdge.faces.length; j++) {
    face = windgedEdge.faces[j];
    edge_a = face.edge;
    edge_b = edge_a.edge_right_cw;
    edge_c = edge_a.edge_right_ccw;

    for (var i = 0; i < positions.length; i++) {

      if (positions[i][0] == edge_a.vert_origin[0] && positions[i][1] == edge_a.vert_origin[1] && positions[i][2] == edge_a.vert_origin[2])
        var vertex_1= i;
      if (positions[i][0] == edge_a.vert_dest[0] && positions[i][1] == edge_a.vert_dest[1] && positions[i][2] == edge_a.vert_dest[2])
        var vertex_2= i;
      if (positions[i][0] == edge_b.vert_origin[0] && positions[i][1] == edge_b.vert_origin[1] && positions[i][2] == edge_b.vert_origin[2])
        var vertex_3= i;
    }
    if (vertex_3 == vertex_1)
    {
      for (var i = 0; i < positions.length; i++) {
        if (positions[i][0] == edge_b.vert_dest[0] && positions[i][1] == edge_b.vert_dest[1] && positions[i][2] == edge_b.vert_dest[2])
          vertex_3= i;
      }
    }
    if (vertex_3 == vertex_2)
    {
      for (var i = 0; i < positions.length; i++) {
        if (positions[i][0] == edge_b.vert_dest[0] && positions[i][1] == edge_b.vert_dest[1] && positions[i][2] == edge_b.vert_dest[2])
          vertex_3= i;
      }
    }
   
    normal = compute_normal(edge_b, edge_a);
    normal_per_vertex[vertex_1].push(normal);
    normal_per_vertex[vertex_2].push(normal);
    normal_per_vertex[vertex_3].push(normal);

  }

  normals = [];
  average_normals = [];
   for (var i=0; i<normal_per_vertex.length;i++)
  {
    var normal = normal_per_vertex[i];
    normals.push(normal[0]);

    var set  = new Set(normal.map(JSON.stringify));
    var unique_normal = Array.from(set).map(JSON.parse);

    var mean_normal = math.mean(unique_normal);
    var norm_average = math.divide(mean_normal, math.norm(mean_normal))
    average_normals.push(norm_average)
    
  }

  // console.log(normal);
  window.normals = normals;
  window.average_normals = average_normals;
  // window.normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0];

}


function compute_normal(edge_a, edge_b){
  a = [edge_a.vert_dest[0] - edge_a.vert_origin[0], edge_a.vert_dest[1] - edge_a.vert_origin[1], edge_a.vert_dest[2] - edge_a.vert_origin[2]];
  b = [edge_b.vert_dest[0] - edge_b.vert_origin[0], edge_b.vert_dest[1] - edge_b.vert_origin[1], edge_b.vert_dest[2] - edge_b.vert_origin[2]];
  // console.log(a);
  N = math.cross(a,b);
  // console.log(math.norm(N));
  N = math.divide(N, math.norm(N));

  return N;

}
// createWingedEdge();

function parseOBJ(text) {
  const objPositions = [];
  const objIndices = [];
  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objIndices,

  ];

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    f(parts) {
      objIndices.push(parts.map(parseFloat));

    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  return {
    position: objPositions,
    indices: objIndices,
  };
}
//A simple function to download files.
function downloadFile(filename,text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

//A buttom to download a file with the name provided by the user
function downloadFileFunction(){
	// Get the file name from the textbox.
  // console.log(file)
	var filename = document.getElementById("filename_save").value;
	var position = window.positions;
  var index = window.indices;
  var obj = "";
  obj += "#";
  obj += position.length/3;
  obj += " "
  obj += index.length/3;
  obj += "\n";
  for (var i = 0; i < position.length; i += 3) {
      // stringPosition.concat("v");
      obj += "v ";
      obj += position[i].toString();
      obj += " ";
      obj += position[i+1].toString();
      obj += " ";
      obj += position[i+2].toString();
      obj += "\n";

  } 
    for (var i = 0; i < index.length; i += 3) {
      // stringPosition.concat("v");
      obj += "f ";
      obj += index[i].toString();
      obj += " ";
      obj += index[i+1].toString();
      obj += " ";
      obj += index[i+2].toString();
      obj += "\n";

  } 

	// Start file download.
	downloadFile(filename,obj);
}

// This is how to display error messages
function showAnErrorFunction(){
	alert("Error!!!");
}

function updateRotate_x(slideAmount) {
	rotation_x += parseFloat(slideAmount);
}

function updateRotate_y(slideAmount) {
  rotation_y += parseFloat(slideAmount);
  //console.log(cubeRotation);
}

function updateRotate_z(slideAmount) {
  rotation_z += parseFloat(slideAmount);
}

function updateTrans_x(slideAmount) {
  var sliderDiv = document.getElementById("sliderTrans_x");
  translation_x = parseFloat(slideAmount);
  // console.log(translation);
}
function updateTrans_y(slideAmount) {
  var sliderDiv = document.getElementById("sliderTrans_y");
  translation_y = parseFloat(slideAmount);
  // console.log(translation);
}

function updateZoom(slideAmount) {
  var sliderDiv = document.getElementById("sliderZoom");
  zooming = parseFloat(slideAmount);
  // console.log(translation);
}

//
// Start here
//

async function main() {
  var filename = document.getElementById("filename").value;
  // console.log(filename);
  const canvas = document.querySelector('#glcanvas');
  window.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  var client = new XMLHttpRequest();
    //load an obj model from an online source, such as GitHub or Professor Richard's website.
    //To change the file being opened, just change the link below.
    //You can't open files locally due to safety constraints.
  const response = await fetch(filename);  
  const text = await response.text();
  window.data = parseOBJ(text);
  window.vertexCount = data.indices.flat().length;
  // console.log(vertexCount);

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec3 aVertexNormal;
    attribute vec3 aVertexNormalSmooth;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec3 vLighting;
    uniform mat4 uNormalMatrix;
    uniform lowp float uToSmooth;

    varying lowp vec4 vColor;
    varying lowp vec3 vNormal;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;

      vNormal = mat3(uModelViewMatrix) * aVertexNormal * (1.0-uToSmooth) + mat3(uModelViewMatrix) * aVertexNormalSmooth * (uToSmooth) ;
      lowp vec3 directionalLight = normalize(vec3(1, 0, 1));
      lowp vec4 Normal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      lowp float directional = max(dot(Normal.xyz, directionalLight), 0.0);
      vLighting = vec3(0.5, 0.5, 0.5) + directional;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    varying lowp vec3 vNormal;
    varying lowp vec3 vLighting;
    uniform lowp vec3 uReverseLightDirection;
    uniform lowp float uToShade;
    lowp vec4 fragColor_shading;
    lowp vec4 fragColor_noShading;
    void main(void) {
      fragColor_noShading = vColor;
      fragColor_shading = fragColor_noShading *  vec4(vLighting,1);
      gl_FragColor = fragColor_shading * uToShade + fragColor_noShading * (1.0 - uToShade);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(window.gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  window.programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
      vertexNormalSmooth: gl.getAttribLocation(shaderProgram, "aVertexNormalSmooth"),


    },
    uniformLocations: {
      toShade: gl.getUniformLocation(shaderProgram, "uToShade"),
      toSmooth: gl.getUniformLocation(shaderProgram, "uToSmooth"),
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      reverseLightDirectionLocation: gl.getUniformLocation(shaderProgram, "uReverseLightDirection"),
    }
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  var buffers = initBuffers(window.gl,window.data);

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, deltaTime, vertexCount);
    if (to_wireframe == false && to_meshEdges == false)
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function triangleToWireframe(indices){

  var wireframe_indices = [];

  for (var j = 0; j < indices.length; j=j+3) {
    wireframe_indices.push(indices[j]);
    wireframe_indices.push(indices[j+1]);
    wireframe_indices.push(indices[j+1]);
    wireframe_indices.push(indices[j+2]);
    wireframe_indices.push(indices[j+2]);
    wireframe_indices.push(indices[j]);

  }
    // Repeat each color four times for the four vertices of the face
    // if smooth shading is on 4, if flat shading is on 6
    // colors = colors.concat(c, c, c, c, c, c);
    return wireframe_indices;
  
}

// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl,data) {
  // console.log("init buffer")
  // Create a buffer for the cube's vertex positions.
  // console.log(data);
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.
  // For now it is hard coded, but you should parse the obj file to this format,
  // change the positions variable and redraw the scene.
  if (typeof data !== 'undefined'){
    // console.log(data);
    var positionsOBJ = data.position;
    var indicesOBJ = data.indices;
    var normals = [];
    var vertexCount = 0;
    for (var i = 0; i < positionsOBJ.length; i++) {
      vertexCount += 3;
      for (var j=0; j<3; j++) {
        window.positions.push(positionsOBJ[i][j]);

      }
    }

    for (var i = 0; i < indicesOBJ.length; i++) {
      for (var j=0; j<3; j++) {
        window.indices.push(indicesOBJ[i][j]-1);
      }
    }
    var positions = window.positions;
    var indices = window.indices;
    createWingedEdge(positionsOBJ, window.indices);
    if (to_wireframe == true){
      // console.log("here")
      indices = triangleToWireframe(window.indices);
      // console.log(window.indices)
    }
    // console.log(normals);
  //   positions =[-1.0, 1.0, -1.0,
  //               1.0, 1.0, -1.0,
  //               1.0, -1.0, -1.0,
  //               -1.0, -1.0, -1.0,
  //               -1.0, 1.0, 1.0,
  //               1.0, 1.0, 1.0,
  //               1.0, -1.0, 1.0,
  //               -1.0, -1.0, 1.0];
  //   indices = [1, 2, 3,
  //             1, 3, 4,
  //             2, 7, 3,
  //             2, 6, 7,
  //             1, 6, 2,
  //             1, 5, 6,
  //             3, 7, 8,
  //             3, 8, 4,
  //             8, 5, 1,
  //             8, 1, 4,
  //             5, 7, 6,
  //             5, 8, 7];        
  //   for (var j = 0; j < indices.length; ++j) {
  
  //   indices[j] = indices[j] - 1;
  // }
             
  }



  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
// Create a buffer to put normals in
  var normalBuffer = gl.createBuffer();
// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = normalBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);


  // Now pass the list of normals into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(window.normals.flat()), gl.STATIC_DRAW);
  // console.log(window.normals.flat());

  var normalSmoothBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalSmoothBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(window.average_normals.flat()), gl.STATIC_DRAW);
  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  const faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [0.0,  1.0,  1.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.
  var ran= Math.random();
  // console.log(ran)
  var colors = [];
  for (var i = 0; i < window.indices.length; i++) {
    // console.log(i)
    if (to_wireframe == true)
        var c = faceColors[0];
    else
        var c = [0.5+Math.random(), 0.5+Math.random(), 0.5+Math.random(), 0.8];

    colors = colors.concat(c);
  }


  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.



  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
    normal: normalBuffer,
    count: vertexCount,
    normalSmooth: normalSmoothBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, deltaTime, vertexCount, secondBuffer = false) {
  if (secondBuffer == false){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything

  }
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  if (secondBuffer == false)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  // console.log(translation);
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [translation_x, translation_y,-6.0 + zooming]);  // amount to translate

  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              rotation_z,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              rotation_x * .7,// amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (X)
    mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              rotation_y * .7,// amount to rotate in radians
              [1, 0, 0]);       // axis to rotate around (X)
  // mat4.scale(modelViewMatrix,modelViewMatrix, [zooming, zooming, zooming]);
  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }


  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL how to pull out the normals from the normal buffer
  // into the vertexNormal attribute.
  {
    // Turn on the normal attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
     
    // Bind the normal buffer.
     
    // Tell the attribute how to get data out of normalBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = false; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal, size, type, normalize, stride, offset)

  }

    {
    // Turn on the normal attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalSmooth);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormalSmooth);
     
    // Bind the normal buffer.
     
    // Tell the attribute how to get data out of normalBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = false; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormalSmooth, size, type, normalize, stride, offset)

  }


  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);
  gl.uniform1f(programInfo.uniformLocations.toSmooth, to_smooth);
  gl.uniform1f(programInfo.uniformLocations.toShade, to_shade);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix);
  // Set the shader uniforms
  gl.uniform3fv(programInfo.uniformLocations.reverseLightDirectionLocation, m4.normalize([0.5, 0.7, 1]));
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  { 
    // console.log(buffers.vertex);
    // const vertexCount = buffers.position.length;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
	
    //This is how you draw triangles
    if (to_wireframe == true)
	   gl.drawElements(gl.LINES, vertexCount*2, type, offset);
  
  
   else
   gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function no_shading(){
  to_shade = 0.0;
  to_wireframe = false;
  var then = 0;
   var del = false;
  if (to_meshEdges == true){
    del = true;
    to_meshEdges = false;
  }
  buffers = initBuffers(window.gl,window.data);
  function render(now) {
    now *= 0.001;  // convert to seconds
  const deltaTime = now - then;
  then = now;

  drawScene(gl, window.programInfo, buffers, deltaTime, vertexCount,del);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
}

function flat_shading(){
  to_shade = 1.0;
  to_smooth = 0.0;
     var del = false;

  to_wireframe = false;
  to_meshEdges = false;
  if (to_meshEdges == true){
    del = true;
    to_meshEdges = false;
  }
    var then = 0;

  buffers = initBuffers(window.gl,window.data);
  function render(now) {
    now *= 0.001;  // convert to seconds
  const deltaTime = now - then;
  then = now;

  drawScene(gl, window.programInfo, buffers, deltaTime, vertexCount,del);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

}

function smooth_shading(){
  to_shade = 1.0;
  to_smooth = 1.0;
     var del = false;

  to_wireframe = false;
  to_meshEdges = false;
  if (to_meshEdges == true){
    del = true;
    to_meshEdges = false;
  }
    var then = 0;

  buffers = initBuffers(window.gl,window.data);
  function render(now) {
    now *= 0.001;  // convert to seconds
  const deltaTime = now - then;
  then = now;

  drawScene(gl, window.programInfo, buffers, deltaTime, vertexCount,del);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
}




function wireframe_render(){
  var del = false;
  if (to_meshEdges == true){
    del = true;
    to_meshEdges = false;
  }
  to_wireframe = true;
  var then = 0;
  to_shade = 0.0;
  to_smooth = 0.0;

  // Draw the scene repeatedly
  buffers = initBuffers(window.gl,window.data);
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

  drawScene(gl, window.programInfo, buffers, deltaTime, vertexCount,del);
  // console.log(buffers);
  if (to_wireframe==true){
  requestAnimationFrame(render);
  // console.log("here")
}
}
requestAnimationFrame(render);

}

function meshEdges_render(){
  to_meshEdges = true;
  var then = 0;
  to_shade = 0.0;
  to_smooth = 0.0;
  // Draw the scene repeatedly
  to_wireframe = true;
  buffers_lines = initBuffers(window.gl,window.data);
  to_wireframe = false;
  buffers_triangles = initBuffers(window.gl, window.data);
  // console.log(buffers_lines);
  // console.log(buffers_triangles);
  function render(now) {
    now *= 0.001;  // convert to seconds
  const deltaTime = now - then;
  then = now;
  // console.log("here")
  drawScene(gl, window.programInfo, buffers_triangles, deltaTime, vertexCount, false);
  to_wireframe = true;
  drawScene(gl, window.programInfo, buffers_lines, deltaTime, vertexCount, true);
  to_wireframe = false;
  if(to_meshEdges == true)
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

}

// main();