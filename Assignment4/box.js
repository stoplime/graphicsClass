
// var model_height = 1;
// var model_width = 1;
// var model_depth = 1;
// var model_center = [0,0,0];
// var model_base = [model_center[0],
//     model_center[1]-model_height/2,
//     model_center[2]];

function box_model() {
    var points = [];

    /*
        This code is derived from the code for chapter 4 in the text.
        */
    function quad(a, b, c, d)
    {
        var vertices = [
            vec4( -0.5, -0.5,  0.5, 1.0 ),
            vec4( -0.5,  0.5,  0.5, 1.0 ),
            vec4(  0.5,  0.5,  0.5, 1.0 ),
            vec4(  0.5, -0.5,  0.5, 1.0 ),
            vec4( -0.5, -0.5, -0.5, 1.0 ),
            vec4( -0.5,  0.5, -0.5, 1.0 ),
            vec4(  0.5,  0.5, -0.5, 1.0 ),
            vec4(  0.5, -0.5, -0.5, 1.0 )
        ];


        // We need to parition the quad into two triangles in order for
        // WebGL to be able to render it.  In this case, we create two
        // triangles from the quad indices

        //vertex color assigned by the index of the vertex

        var indices = [ a, b, c, a, c, d ];

        for ( var i = 0; i < indices.length; ++i ) {
            points.push( vertices[indices[i]] );
        }
    }

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    return points;
}

function box_color_scheme(color1, color2) {
    var colors = [];
    if (!color1)
        color1 = vec4(.5, .5, .5, 1.0);
    if (!color2)
        color2 = color1;
    for(var i = 0; i < 6; i++) {
        colors.push(color1);
        colors.push(color1);
        colors.push(color1);
        colors.push(color2);
        colors.push(color2);
        colors.push(color2);
    }
    return colors;
}

function box_color_scheme2(color1, color2) {
    var colors = [];
    if (!color1)
        color1 = vec4(.5, .5, .5, 1.0);
    if (!color2)
        color2 = color1;
    for(var i = 0; i < 3; i++) {
        colors.push(color1);
        colors.push(color1);
        colors.push(color1);
        colors.push(color1);
        colors.push(color1);
        colors.push(color1);
        colors.push(color2);
        colors.push(color2);
        colors.push(color2);
        colors.push(color2);
        colors.push(color2);
        colors.push(color2);
    }
    return colors;
}

/**
 * Returns a list of points  that describes a box with
 * bottom center based at a given point and given width and height and depth.
 *
 * @param base  A vec4 specifying the position of the base of the cylinder
 *      It would be (0,-.5,0) without moving it.
 */
function box_base_size(base, height, width, depth) {
    var trans1 = translate(0, .5, 0);
    var scale = scalem(width, height, depth);
    var trans = translate(base[0], base[1], base[2]);
    var both = mult(trans, mult(scale,trans1));
    return box_model().map((p) => mult(both,p));
}