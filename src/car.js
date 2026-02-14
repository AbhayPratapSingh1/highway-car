// @ts-nocheck


const createCar = () => {
  const { x, y, z, h, w, d, color, stroke } = CAR_CONFIGURATION;
  const carShape = new CarShape(x, y, z, h, w, d, color, stroke);
  return new Car(carShape);
};

const createCitizenCar = (x, y, z, h, w, d) => {
  const colors = [random(WORLD_CONSTANTS.UNIVERSAL_PALETTE)];
  const stroke = [0, 0, 0, 50];
  const carShape = new CarShape(x, y, z, h, w, d, colors, stroke);
  return new CitizensCar(carShape);
};

class CitizensCar {
  constructor(shape) {
    this.shape = shape;
    this.pos = this.shape.pos;
    this.v = createVector(0, 0, random(10, 30));
    this.a = createVector(0, 0, 0);
  }

  isAnyPointOutLeft = () => {
    const worldW2 = WORLD_CONSTANTS.ROAD.WIDTH / 2;
    return this.shape.points.some((point) => point.x < worldW2);
  };
  isAnyPointOutRight = () => {
    const worldW2 = WORLD_CONSTANTS.ROAD.WIDTH / 2;
    return this.shape.points.some((point) => point.x > worldW2);
  };

  update() {
    this.pos.add(this.v);
    this.shape.points.forEach((point) => {
      point.add(this.v);
    });
  }
}

class Car {
  constructor(shape) {
    this.shape = shape;
    this.pos = this.shape.pos;
    this.v = createVector(0, 0, 0);
    this.a = createVector(0, 0, 0);
  }

  callback() {
    const deltaZ = WORLD_CONSTANTS.CAR.SENSTIVITY;
    const deltaX = deltaZ * this.v.z / 5;

    if (keyIsDown(UP_ARROW)) this.a.add(0, 0, deltaZ);
    const shouldShift = !nearlyEqual(this.v.z, 0, 1);

    if (keyIsDown(LEFT_ARROW) && shouldShift) this.a.add(-deltaX, 0, 0);

    if (keyIsDown(RIGHT_ARROW) && shouldShift) this.a.add(+deltaX, 0, 0);
  }

  updatePos = () => {
    const delta = (WORLD_CONSTANTS.ROAD.WIDTH - this.shape.w) / 2;

    this.pos.add(this.v);
    if (Math.abs(this.pos.x) > delta) {
      const side = Math.sign(this.pos.x);
      const moveMentSide = Math.sign(this.v.x);
      if (side === moveMentSide) {
        this.pos.x -= this.v.x;
      }
    }
  };

  update() {
    this.callback();
    this.v.add(this.a);

    this.updatePos();

    this.a.mult(0.9);
    this.v.mult(WORLD_CONSTANTS.WORLD.FRICTION);
  }
}
class CarShape {
  constructor(x, y, z, w, h, d, colorPalette, strokeColor = "black") {
    this.pos = createVector(x, y, z);
    this.w = w;
    this.h = h;
    this.d = d;
    this.colorPalette = colorPalette || ["#333", "#444", "#222", "#555"];
    this.strokeColor = strokeColor;

    this.OGpoint = this.createModelVertices();
    this.points = this.createModelVertices();

    this.rotations = createVector(0, 0, 0);
  }

  createBoxVertices(offset, w, h, d) {
    const [w2, h2, d2] = [w / 2, h / 2, d / 2];
    return [
      createVector(-w2 + offset.x, -h2 + offset.y, -d2 + offset.z), // 0
      createVector(-w2 + offset.x, +h2 + offset.y, -d2 + offset.z), // 1
      createVector(+w2 + offset.x, +h2 + offset.y, -d2 + offset.z), // 2
      createVector(+w2 + offset.x, -h2 + offset.y, -d2 + offset.z), // 3
      createVector(+w2 + offset.x, -h2 + offset.y, +d2 + offset.z), // 4
      createVector(+w2 + offset.x, +h2 + offset.y, +d2 + offset.z), // 5
      createVector(-w2 + offset.x, +h2 + offset.y, +d2 + offset.z), // 6
      createVector(-w2 + offset.x, -h2 + offset.y, +d2 + offset.z), // 7
    ];
  }

  createModelVertices() {
    let allVertices = [];

    allVertices.push(
      ...this.createBoxVertices(
        createVector(0, 0, 0),
        this.w,
        this.h * 0.4,
        this.d,
      ),
    );

    const cabinPos = createVector(0, -this.h * 0.4, this.d * 0.05);
    allVertices.push(
      ...this.createBoxVertices(
        cabinPos,
        this.w * 0.85,
        this.h * 0.45,
        this.d * 0.4,
      ),
    );

    const wheelW = this.w * 0.2;
    const wheelH = this.h * 0.3;
    const wheelD = this.d * 0.15;
    const wheelOffsets = [
      createVector(-this.w * 0.45, this.h * 0.2, -this.d * 0.3),
      createVector(this.w * 0.45, this.h * 0.2, -this.d * 0.3),
      createVector(-this.w * 0.45, this.h * 0.2, this.d * 0.3),
      createVector(this.w * 0.45, this.h * 0.2, this.d * 0.3),
    ];

    wheelOffsets.forEach((off) => {
      allVertices.push(...this.createBoxVertices(off, wheelW, wheelH, wheelD));
    });

    return allVertices;
  }

  changeRotation(x = 0, y = 0, z = 0) {
    this.rotations.add(createVector(x, y, z));
  }

  rotateInAxis(point, angle, fromAxis = "x", toAxis = "y") {
    let c = cos(angle);
    let s = sin(angle);
    let fromAxisPoint = point[fromAxis] * c - point[toAxis] * s;
    let toAxisPoint = point[fromAxis] * s + point[toAxis] * c;
    return [fromAxisPoint, toAxisPoint];
  }

  rotateVertices() {
    this.OGpoint.forEach((point, i) => {
      let newX, newY, newZ;
      let dx = 0, dy = 0, dz = 0;

      [newY, newZ] = this.rotateInAxis(point, this.rotations.x, "y", "z");
      dy += newY - point.y;
      dz += newZ - point.z;

      [newZ, newX] = this.rotateInAxis(point, this.rotations.y, "z", "x");
      dx += newX - point.x;
      dz += newZ - point.z;

      [newX, newY] = this.rotateInAxis(point, this.rotations.z, "x", "y");
      dx += newX - point.x;
      dy += newY - point.y;

      this.points[i].x = point.x + dx;
      this.points[i].y = point.y + dy;
      this.points[i].z = point.z + dz;
    });
  }

  getFaces() {
    this.rotateVertices();
    const faces = [];
    const faceIndices = [
      [0, 1, 2, 3],
      [4, 5, 6, 7], // Front, Back
      [0, 3, 4, 7],
      [1, 2, 5, 6], // Top, Bottom
      [0, 7, 6, 1],
      [2, 5, 4, 3], // Left, Right
    ];

    for (let i = 0; i < this.points.length; i += 8) {
      const partPoints = this.points.slice(i, i + 8);
      const isCabin = i === 8;
      const isWheel = i >= 16;

      faceIndices.forEach((idx, fIdx) => {
        let color = this.colorPalette[fIdx % this.colorPalette.length];
        let sCol = this.strokeColor;

        if (isWheel) {
          color = "#111";
          sCol = "#000";
        }
        if (isCabin && fIdx === 0) color = "#88ccff"; // Windshield

        faces.push({
          points: idx.map((index) =>
            p5.Vector.add(partPoints[index], this.pos)
          ),
          color: color,
          strokeColor: sCol,
        });
      });
    }
    return faces;
  }
}
