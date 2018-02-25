"use strict";

var gl;
var points;

var NumPoints = 1000000;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points = [ vec2( 0.0, 0.0 ) ];

    for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * points.length);
        var seedPoint = Array.from(points[j]);
        points.push( generatePoint( Math.random(), seedPoint ) );
    }
    for (var i = 0; i < points.length; i++) {
        points[i][0] *= 0.20;
        points[i][1] *= 0.20;
        points[i][1] -= 1.0;
        // points[i][0] *= 5.0;
        // points[i][1] *= 5.0;
    }
    // console.log(generatePoint( Math.random(), points[0] ));
    console.log(points);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.30, 0.30, 0.30, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function generatePoint(randomNum, point) {
    var newPoint = [0, 0];
    // console.log(point);
    if (randomNum < 0.01) {
        newPoint[0] = 0;
        newPoint[1] = 0.16 * point[1];
        return newPoint;
    }
    else if (randomNum < 0.86) {
        newPoint[0] = 0.85 * point[0] + 0.04 * point[1];
        newPoint[1] = -0.04 * point[0] + 0.85 * point[1] + 1.6;
        return newPoint;
    }
    else if (randomNum < 0.93) {
        newPoint[0] = 0.2 * point[0] - 0.26 * point[1];
        newPoint[1] = 0.23 * point[0] + 0.22 * point[1] + 1.6;
        return newPoint;
    }
    else {
        newPoint[0] = -0.15 * point[0] + 0.28 * point[1];
        newPoint[1] = 0.26 * point[0] + 0.24 * point[1] + 0.44;
        return newPoint;
    }
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}
