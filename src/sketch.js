/// <reference types="p5/global"/>
// @ts-nocheck

const WORLD_CONSTANTS = {
  CAR: {
    SENSTIVITY: 3,
  },
  WORLD: {
    FRICTION: 0.1,
  },
};

class Highway {
  constructor(w) {
    this.w = w;
    this.l = 10_000;
  }
  draw() {
    push();
    fill("black");

    rect(-this.w / 2, -height / 2, this.w, height);
    pop();
  }
}

class Car {
  constructor(x, y, z, l, w, h) {
    this.pos = createVector(x, y, z);
    this.l = l;
    this.w = w;
    this.h = h;
    this.v = createVector(0, 0, 0);
    this.a = createVector(0, 0, 0);
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rect(0, 0, this.w, this.l);
    pop();
  }

  move() {
    const delta = WORLD_CONSTANTS.CAR.SENSTIVITY;
    if (keyIsDown(LEFT_ARROW)) {
      this.a.add(-delta, 0, 0);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.a.add(+delta, 0, 0);
    }
    if (keyIsDown(UP_ARROW)) {
      this.a.add(0, -delta, 0);
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.a.add(0, delta, 0);
    }
  }
  update() {
    this.move();
    this.v.add(this.a);
    this.pos.add(this.v);
    this.a.mult(0.9);
    this.v.mult(WORLD_CONSTANTS.WORLD.FRICTION);
  }
}

const gameState = {
  car: null,
  highway: null,
};

function setup() {
  createCanvas(800, 800);
  gameState.car = new Car(0, 200, 0, 100, 50, 20);
  gameState.highway = new Highway(500);
}

const rotate = (degree, a1 = "x", a2 = "y", reference = undefined) => {
  reference = reference || this.pos;
  this.points.forEach((point) => {
    const [v1, v2] = rotatePointAroundPoint(point, reference, degree, a1, a2);
    point[a1] = v1;
    point[a2] = v2;
  });

  const [v1, v2] = rotatePointAroundPoint(
    this.pos,
    reference,
    degree,
    a1,
    a2,
  );
  this.pos[a1] = v1;
  this.pos[a2] = v2;
};

function draw() {
  translate(width / 2, height / 2);
  background(220);
  gameState.highway.draw();
  gameState.car.draw();
  gameState.car.update();
}
