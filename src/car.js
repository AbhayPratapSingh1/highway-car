// @ts-nocheck
const createCar = (x, y, z, h, w, d) => {
  const carShape = new CarShape(x, y, z, h, w, d, ["#FF1744"], [0, 0, 0, 0]);
  return new Car(carShape);
};

const createCitizenCar = (x, y, z, h, w, d, color, colorTop) => {
  const carShape = new CarShape(x, y, z, h, w, d, [
    random(WORLD_CONSTANTS.UNIVERSAL_PALETTE),
  ], [0, 0, 0, 50]);
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
  updatePos = () => {
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

  move() {
    const delta = WORLD_CONSTANTS.CAR.SENSTIVITY;

    if (keyIsDown(LEFT_ARROW)) {
      this.a.add(-delta, 0, 0);
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.a.add(+delta, 0, 0);
    }

    if (keyIsDown(UP_ARROW)) {
      this.a.add(0, 0, delta);
    }
  }

  isAnyPointOutLeft = () => {
    const worldW2 = WORLD_CONSTANTS.ROAD.WIDTH / 2;
    return this.shape.points.some((point) => point.x < worldW2);
  };
  isAnyPointOutRight = () => {
    const worldW2 = WORLD_CONSTANTS.ROAD.WIDTH / 2;
    return this.shape.points.some((point) => point.x > worldW2);
  };
  updatePos = () => {
    const worldW2 = WORLD_CONSTANTS.ROAD.WIDTH / 2;
    this.pos.add(this.v);
    const dx = this.v.x;

    this.shape.points.forEach((point) => {
      point.add(this.v);
    });

    this.pos.x = constrain(this.pos.x, -worldW2, worldW2);
  };

  update() {
    this.move();
    this.v.add(this.a);

    this.updatePos();
    this.a.mult(0.9);
    this.v.mult(WORLD_CONSTANTS.WORLD.FRICTION);
  }
}

class CarShape {
  constructor(x, y, z, w, h, d, colorPalette) {
    this.pos = createVector(x, y, z);
    this.w = w; // Width
    this.h = h; // Total Height
    this.d = d; // Total Length
    this.colorPalette = colorPalette || ["#333", "#444", "#222", "#555"];

    this.points = [];
    this.parts = []; // Stores indices for different car sections
    this.createModel();
  }

  // Helper to create a box and return its points
  createBox(offset, w, h, d) {
    const w2 = w / 2, h2 = h / 2, d2 = d / 2;
    const p = p5.Vector.add(this.pos, offset);
    return [
      createVector(-w2, -h2, -d2).add(p), // 0: Top-Front-Left
      createVector(-w2, +h2, -d2).add(p), // 1: Bottom-Front-Left
      createVector(+w2, +h2, -d2).add(p), // 2: Bottom-Front-Right
      createVector(+w2, -h2, -d2).add(p), // 3: Top-Front-Right
      createVector(+w2, -h2, +d2).add(p), // 4: Top-Back-Right
      createVector(+w2, +h2, +d2).add(p), // 5: Bottom-Back-Right
      createVector(-w2, +h2, +d2).add(p), // 6: Bottom-Back-Left
      createVector(-w2, -h2, +d2).add(p), // 7: Top-Back-Left
    ];
  }

  createModel() {
    this.points = [];

    // 1. MAIN CHASSIS (Lower body)
    const chassis = this.createBox(
      createVector(0, 0, 0),
      this.w,
      this.h * 0.4,
      this.d,
    );
    this.points.push(...chassis);

    // 2. CABIN (The glass/roof area - slanted forward)
    const cabinW = this.w * 0.85;
    const cabinH = this.h * 0.45;
    const cabinD = this.d * 0.4;
    const cabinPos = createVector(0, -this.h * 0.4, this.d * 0.05);
    const cabin = this.createBox(cabinPos, cabinW, cabinH, cabinD);
    this.points.push(...cabin);

    // 3. WHEELS (4 small blocks)
    const wheelW = this.w * 0.2;
    const wheelH = this.h * 0.3;
    const wheelD = this.d * 0.15;
    const wheelOffsets = [
      createVector(-this.w * 0.45, this.h * 0.2, -this.d * 0.3), // Front Left
      createVector(this.w * 0.45, this.h * 0.2, -this.d * 0.3), // Front Right
      createVector(-this.w * 0.45, this.h * 0.2, this.d * 0.3), // Back Left
      createVector(this.w * 0.45, this.h * 0.2, this.d * 0.3), // Back Right
    ];

    wheelOffsets.forEach((off) => {
      this.points.push(...this.createBox(off, wheelW, wheelH, wheelD));
    });
  }

  getFaces() {
    const faces = [];
    const faceIndices = [
      [0, 1, 2, 3],
      [4, 5, 6, 7], // Front, Back
      [7, 6, 1, 0],
      [3, 2, 5, 4], // Left, Right
      [7, 0, 3, 4],
      [1, 6, 5, 2], // Top, Bottom
    ];

    // Every 8 points in this.points is a new box
    for (let i = 0; i < this.points.length; i += 8) {
      const partPoints = this.points.slice(i, i + 8);
      const isWheel = i >= 16;
      const isCabin = i === 8;

      faceIndices.forEach((idx, fIdx) => {
        let color = this.colorPalette[fIdx % this.colorPalette.length];

        // Custom styling for realism
        if (isWheel) color = "#111"; // Wheels are dark
        if (isCabin && fIdx === 0) color = "#88ccff"; // Front windshield tint

        faces.push({
          points: idx.map((index) => partPoints[index]),
          color: color,
          strokeColor: isWheel ? "#000" : "rgba(0,0,0,0.2)",
        });
      });
    }
    return faces;
  }
}
class Cube {
  constructor(x, y, z, h, w, d, color, strokeColor = "black") {
    color = color || WORLD_ITEMS.palettes;

    this.pos = createVector(x, y, z);
    this.h = h;
    this.w = w;
    this.d = d;

    this.rotations = { x: 0, y: 0, z: 0 };

    this.strokeColor = strokeColor;
    this.color = color;

    this.points = this.createVertices();
  }

  createVertices() {
    const w2 = this.w / 2;
    const h2 = this.h / 2;
    const d2 = this.d / 2;

    const p1 = createVector(-w2, -h2, -d2).add(this.pos); // F-T-L
    const p2 = createVector(-w2, +h2, -d2).add(this.pos); // F-B-L
    const p3 = createVector(+w2, +h2, -d2).add(this.pos); // F-B-R
    const p4 = createVector(+w2, -h2, -d2).add(this.pos); // F-T-R
    const p5 = createVector(+w2, -h2, +d2).add(this.pos); // B-T-R
    const p6 = createVector(+w2, +h2, +d2).add(this.pos); // B-B-R
    const p7 = createVector(-w2, +h2, +d2).add(this.pos); // B-B-L
    const p8 = createVector(-w2, -h2, +d2).add(this.pos); // B-T-L
    return [p1, p2, p3, p4, p5, p6, p7, p8];
  }

  getFaces() {
    const [p1, p2, p3, p4, p5, p6, p7, p8] = this.points;

    const f1 = [p1, p2, p3, p4]; // front
    const f2 = [p5, p6, p7, p8]; // back
    const f3 = [p8, p7, p2, p1]; // left
    const f4 = [p4, p3, p6, p5]; // right
    const f5 = [p8, p1, p4, p5]; // top
    const f6 = [p2, p7, p6, p3]; // bottom

    const val = [f1, f2, f3, f4, f5, f6].map((points, i) => ({
      strokeColor: this.strokeColor,
      color: this.color[i % this.color.length],
      points,
    }));

    return val;
  }

  rotate(degree, a1 = "x", a2 = "y", reference = undefined) {
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
  }
}
