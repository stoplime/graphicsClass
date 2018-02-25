"use strict";

var gl;
var points;

var depth = 5;
var turn = 60;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // points = [ vec2( -0.866, -0.5) ];
    points = [];
    var startDist = 0.005;
    var turtle = new Turtle(vec2( 0, 0), 0);

    var manTurn = 155;
    var sides = 72;
    for (var i = 0; i < sides-1; i++) {
        KochPattern(turtle, startDist, depth);
        turtle.addAngle(manTurn);
        startDist *= 1.15;
    }
    KochPattern(turtle, startDist, depth);
    
    // console.log(generatePoint( Math.random(), points[0] ));
    // console.log(points);

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

    gl.lineWidth(1.5);

    render();
};

function KochPattern(turtle, dist, depth){
    if (depth <= 0) {
        var newPoint = turtle.forward(dist);
        points.push(newPoint);
        return;
    }
    var distFract = 1/(2*Math.cos(turn*Math.PI/180)+2);
    KochPattern(turtle, dist*distFract, depth-1);
    turtle.addAngle(-turn);
    KochPattern(turtle, dist*distFract, depth-1);
    turtle.addAngle(2*turn);
    KochPattern(turtle, dist*distFract, depth-1);
    turtle.addAngle(-turn);
    KochPattern(turtle, dist*distFract, depth-1);
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
    // gl.drawArrays( gl.LINE_STRIP, 0, points.length );

    // window.requestAnimationFrame(render);
}
