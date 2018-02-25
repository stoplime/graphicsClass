"use strict";

class Turtle {
    constructor(position, angle) {
      this.position = position;
      this.angle = angle;
    }

    forward(distance) {
        this.position[0] += distance * Math.cos(this.angle * (Math.PI / 180));
        this.position[1] += distance * Math.sin(this.angle * (Math.PI / 180));
        return vec2(this.position[0], this.position[1]);
    }

    addAngle(deltaAngle) {
        this.angle += deltaAngle;
        // this.angle = this.angle;
        return this.angle;
    }

    static clamp(angle) {
        while (angle > 180) {
            angle -= 360;
        }
        while (angle < -180) {
            angle += 360;
        }
        return angle;
    }
}