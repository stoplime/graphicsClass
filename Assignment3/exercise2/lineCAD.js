"use strict";

var canvas;
var gl;

var maxNumVertices  = 200;
var index = 0;

var cindex = 0;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.4, 0.5, 0.6, 1.0 ),  // SlateGray
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];
var t;
var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

// *** Added mesh lists ***
var meshIndecies = [0];
var mesh = [];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var menu = document.getElementById("colorMenu");
    menu.addEventListener("click", function() {
        cindex = menu.selectedIndex;
    });

    var button = document.getElementById("drawButton")
    button.addEventListener("click", function(){
        // *** Figure out which lines to make for the mesh ***
        var meshLines = [];
        var meshColors = [];
        for (let i = 0; i < mesh.length; i++) {
            if (i >= 1) {
                meshLines.push(mesh[i-1]);
                meshLines.push(mesh[i]);
                meshColors.push(vec4( 0.0, 0.0, 0.0, 1.0 ));
                meshColors.push(vec4( 0.0, 0.0, 0.0, 1.0 ));
            }
            if (i >= 2) {
                meshLines.push(mesh[i-2]);
                meshLines.push(mesh[i]);
                meshColors.push(vec4( 0.0, 0.0, 0.0, 1.0 ));
                meshColors.push(vec4( 0.0, 0.0, 0.0, 1.0 ));
            }
        }
        // *** clear mesh for next shape ***
        mesh = [];

        // *** Shove in the mesh ***
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(meshLines));
        
        // *** shove in the Colors (not very efficient but meh) ***
        gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(meshColors));

        // *** Remember how many indecies there are for the mesh lines (so that we can parce it in the draw) ***
        meshIndecies[numPolygons] = meshLines.length;

        // *** iterate next shape (don't forget to add the meshLines to the index) ***
        numPolygons++;
        index += meshLines.length;

        // *** setup for next shape
        numIndices[numPolygons] = 0;
        start[numPolygons] = index;
        render();
    });

    canvas.addEventListener("mousedown", function(event){
        var offsetMouse = getMousePos(canvas, event);
        t  = vec2(2*offsetMouse.x/canvas.width-1,
           2*(canvas.height-offsetMouse.y)/canvas.height-1);
        
        mesh.push(t);

        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

        t = vec4(colors[cindex+1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

        numIndices[numPolygons]++;
        index++;
        render();
    } );

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.lineWidth(2.0);

    // *** Draw the existing Shapes and Mesh lines ***
    for(var i=0; i<numPolygons; i++) {
        gl.drawArrays( gl.TRIANGLE_STRIP, start[i], numIndices[i] );
        gl.drawArrays( gl.LINES, start[i]+numIndices[i], meshIndecies[i] );
    }

    // *** Draw the partial Shapes ***
    if (numIndices[numPolygons] === 1) {
        gl.drawArrays( gl.POINTS, start[numPolygons], numIndices[numPolygons] );
    }
    else if (numIndices[numPolygons] === 2) {
        gl.drawArrays( gl.LINE_STRIP, start[numPolygons], numIndices[numPolygons] );
    }
    else if (numIndices[numPolygons] > 2) {
        gl.drawArrays( gl.TRIANGLE_STRIP, start[numPolygons], numIndices[numPolygons] );
    }
}
