// @ts-nocheck

const isBetween = (min, value, max) => value < max && value > min;

const isCollide = (shape, rect) => {
  const delta = WORLD_CONSTANTS.WORLD.collisionDelta;
  const { x: x2, y: y2 } = shape;
  const { x, y, h, w } = rect;

  return x > x2 - w / 2 - delta && x < x2 + w / 2 + delta &&
    y > y2 - h / 2 - delta && y < y2 + h / 2 + delta;
};

const rotatePointAroundPoint = (p1, p2, da, k1 = "x", k2 = "z") => {
  const dx = p1[k1] - p2[k1];
  const dz = p1[k2] - p2[k2];

  const angle = Math.atan2(dz, dx) + radians(da);
  const radius = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));

  const key1Value = Math.sin(angle) * radius + p2[k2];
  const key2Value = Math.cos(angle) * radius + p2[k1];

  return [key2Value, key1Value];
};

const normal = (p1, p2, p3) => {
  const s1 = p5.Vector.sub(p1, p2);
  const s2 = p5.Vector.sub(p3, p2);

  return s2.cross(s1);
};

const getProspectivePoint = (point, screen = WORLD_CONSTANTS.SCREEN.Z) => {
  const zUnitVector = createVector(0, 0, 1);

  const zProjectionP1 = point.dot(zUnitVector);

  const ratio = screen / zProjectionP1;

  const xRatio = ratio * point.x;
  const yRatio = ratio * point.y;

  return createVector(xRatio, yRatio, screen);
};

const centerOfFace = (...points) => {
  const faceCenterX = points.reduce((s, p) => s + p.x, 0) / points.length;
  const faceCenterY = points.reduce((s, p) => s + p.y, 0) / points.length;
  const faceCenterZ = points.reduce((s, p) => s + p.z, 0) / points.length;

  return createVector(faceCenterX, faceCenterY, faceCenterZ);
};

const shapeWithDetails = ({ points, ...props }) => {
  const faceNormal = normal(...points);
  const center = centerOfFace(...points);
  return { normal: faceNormal, points, center, ...props };
};

const getAllFacesWithDetail = (objects) => {
  const faces = objects.flatMap((each) => each.getFaces());

  const faceWithNormalAndCenter = faces.map((face) => shapeWithDetails(face));
  return faceWithNormalAndCenter;
};

const getSortedFaces = (faces) => faces.sort((a, b) => b.center.z - a.center.z);

const projectionPoint = (point, z = WORLD_CONSTANTS.SCREEN.Z) =>
  getProspectivePoint(point, z);

const faceProjection = ({ points, ...props }) => {
  const projectionPoints = points.map((point) => projectionPoint(point));
  return { points: projectionPoints, ...props };
};

const shapesProjections = (faces) => faces.map((face) => faceProjection(face));

const getVisibleFaces = (faces) =>
  faces.filter((face) => face.normal.dot(face.center) < 0);

const getClippedPoint = (p1, p2) => {
  const targetZ = 0.1;

  const diff = p2.z - p1.z;

  const ratio = diff === 0 ? 0 : ((targetZ - p1.z) / diff);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const x = (dx * ratio) + p1.x;
  const y = (dy * ratio) + p1.y;

  return createVector(x, y, targetZ);
};

const clipFace = (face) => {
  const points = [];
  const facePoints = face.points;
  for (let i = 0; i < facePoints.length; i++) {
    const prev = facePoints.at(i - 1);
    const current = facePoints[i];
    const next = facePoints[(i + 1) % facePoints.length];
    if (current.z >= 0.1) {
      if (next.z >= 0.1) {
        points.push(next);
      } else {
        points.push(getClippedPoint(current, next));
      }
    } else {
      if (next.z >= 0.1) {
        points.push(getClippedPoint(current, next));
        points.push(next);
      }
    }
  }
  return { ...face, points };
};

const drawFace = (face) => {
  if (!face.points || face.points.length < 3) return;

  fill(face.color);

  stroke(face.strokeColor || [0, 0, 0, 0]);
  strokeWeight(0);

  beginShape();
  for (const point of face.points) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
};
