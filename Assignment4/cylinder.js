

/**
 * Return a list of points that define triangles approximating a cylinder.
 * The cylinder is centered at the origin of height 1 and diameter 1.
 * Axis of the cylinder is along the y-axis.
 *
 * @param sides Number of sides to use in approximating the circular cross
 *      section.  Must be at least 3.
 */
function cylinder_model(sides) {
    if (!sides)
        sides = 30;
    var height = 1;
    var diameter = 1;
    var radius = diameter / 2;
    var z0 = height / 2;
    var z1 = -z0;
    var cpoints = [];
    if (sides < 3)
        return;
    else {
        var delta = 2 * Math.PI / sides;
        for (var s = 0; s < sides; s++) {
            // console.log("s = " + s);
            // console.log("angle " + s * delta / Math.PI * 180);
            // side s, from angle s*2*pi/sides to (s+1)*2*pi/sides
            var x0 = Math.cos(s * delta) * radius;
            var y0 = Math.sin(s * delta) * radius;
            var x1 = Math.cos((s + 1) * delta) * radius;
            var y1 = Math.sin((s + 1) * delta) * radius;
            cpoints.push(vec4(x1, z0, y1));
            cpoints.push(vec4(x0, z0, y0));
            cpoints.push(vec4(x1, z1, y1));
            cpoints.push(vec4(x0, z1, y0));
            cpoints.push(vec4(x1, z1, y1));
            cpoints.push(vec4(x0, z0, y0));
        }
        // var rotmat = rotateX(90);
        // for (var i = 0; i < cpoints.length; i++) {
        //     cpoints[i] = mult(rotmat, cpoints[i]);
        // }
        // cpoints = cpoints.map((p) => mult(rotmat,p));

        // console.log(cpoints);
        return cpoints;

    }
}


function cylinder_colors(sides, color1, color2) {
    if(!color1)
        color1 = vec4(.5,.5,.5,1.0);
    if(!color2)
        color2 = color1;
    if(!sides)
        sides = 30;
    var ccolors = [];
    if(sides < 3)
        return;
    else {
        for(var s = 0; s < sides; s++ ) {
            ccolors.push(color1);
            ccolors.push(color1);
            ccolors.push(color1);
            ccolors.push(color2);
            ccolors.push(color2);
            ccolors.push(color2);
        }
        return ccolors;
    }
}





/**
 * Returns a list of points  that describes a cylinder with
 * vertical axis based at a given point and given width and height.
 *
 * @param steps Number of steps used to approximate the circular cross section.
 *          Must be at least 3.
 * @param base  A vec4 specifying the position of the base of the cylinder
 *      It would be (0,-.5,0) without moving it.
 * @param height Desired height
 * @param diameter  Desired width.
 */
function cylinder_base_size(steps, base, height, diameter) {
    var t = cylinder_model(steps);
    var tr1 = scalem(diameter, height, diameter);
    var tr2 = translate(base[0], base[1]+.5*height, base[2]);
    //console.log(printm(tr2));
    var tr3 = mult(tr2, tr1);
    var pnts = [];
    for(var i = 0; i < t.length; i++ ) {
        pnts.push(mult(tr3, t[i]));
    }

    return pnts;
}