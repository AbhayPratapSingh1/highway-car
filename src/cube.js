// @ts-nocheck

class Cube {
  constructor(x, y, z, h, w, d, color, strokeColor = "black") {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.w = w;
    this.d = d;
    this.OGpoint = this.createVertices();
    this.points = this.createVertices();
    this.faces = this.createFaces();

    this.rotations = createVector(0, 0, 0);

    this.strokeColor = strokeColor;
    this.color = color;
  }

  updatePosAxis(axis, by) {
    this.pos[axis] += by;
  }

  createVertices() {
    // {FRONT/BACK} <-> {LEFT/RIGHT} <-> {TOP/BOTTOM}
    const [w2, h2, d2] = [this.w / 2, this.h / 2, this.d / 2];
    const p1 = createVector(-w2, -h2, -d2); // (F-L-T)
    const p2 = createVector(-w2, +h2, -d2); // (F-L-B)
    const p3 = createVector(+w2, +h2, -d2); // (F-R-B)
    const p4 = createVector(+w2, -h2, -d2); // (F-R-T)
    const p5 = createVector(+w2, -h2, +d2); // (B-R-T)
    const p6 = createVector(+w2, +h2, +d2); // (B-R-B)
    const p7 = createVector(-w2, +h2, +d2); // (B-L-B)
    const p8 = createVector(-w2, -h2, +d2); // (B-L-T)
    return [p1, p2, p3, p4, p5, p6, p7, p8];
  }

  createFaces() {
    const [p1, p2, p3, p4, p5, p6, p7, p8] = this.points;

    const f1 = [p1, p2, p3, p4]; // FRONT
    const f2 = [p5, p6, p7, p8]; // BACK
    const f3 = [p1, p4, p5, p8]; // TOP
    const f4 = [p7, p6, p3, p2]; // BOTTOM
    const f5 = [p1, p8, p7, p2]; // LEFT
    const f6 = [p4, p3, p6, p5]; // RIGHT

    return [f1, f2, f3, f4, f5, f6];
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
    // this.OGpoint = this.createVertices();
    // this.rotateVertices();
    return this.faces.map((points, i) => {
      const projectedPoints = points.map((point) => {
        return p5.Vector.add(point, this.pos);
      });

      return {
        points: projectedPoints,
        strokeColor: this.strokeColor,
        color: this.color[i % this.color.length],
      };
    });
  }
}
