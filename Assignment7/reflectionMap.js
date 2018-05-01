"use strict";

var canvas;
var gl;
var program;

var numVertices  = 36;

var texSize = 4;
var numChecks = 2;

var flag = true;

var red = new Uint8Array([255, 0, 0, 255]);
var green = new Uint8Array([0, 255, 0, 255]);
var blue = new Uint8Array([0, 0, 255, 255]);
var cyan = new Uint8Array([0, 255, 255, 255]);
var magenta = new Uint8Array([255, 0, 255, 255]);
var yellow = new Uint8Array([255, 255, 0, 255]);

var cubeMap;

var pointsArray = [];
var normalsArray = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];


window.onload = init;


var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = [0.0, 0.0, 0.0];

function configureCubeMap(imageids) {

    var image1 = document.getElementById(imageids[0]);
    var image2 = document.getElementById(imageids[1]);
    var image3 = document.getElementById(imageids[2]);
    var image4 = document.getElementById(imageids[3]);
    var image5 = document.getElementById(imageids[4]);
    var image6 = document.getElementById(imageids[5]);
    console.log(image3);

    cubeMap = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image3);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image4);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image5);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image6);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
}

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[a]);
     var normal = cross(t1, t2);
     normal[3] = 0.0;

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);;

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);;

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);;

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);;
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal");
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var projectionMatrix = ortho(-2, 2, -2, 2, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix" ), false, flatten(projectionMatrix) );

    var images = ["image1", "image2", "image3", "image4", "image5", "image6"]
    configureCubeMap(images);
    gl.activeTexture( gl.TEXTURE0 );
    gl.uniform1i(gl.getUniformLocation(program, "texMap"),0);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;}
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag) theta[axis] += 2.0;

    var eye = vec3(0.0, 0.0, 1.0);
    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);

    var modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0]));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0]));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1]));

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix) );

    var normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
}
