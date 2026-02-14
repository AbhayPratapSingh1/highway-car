/// <reference types="p5/global"/>
// @ts-nocheck

const WORLD_CONSTANTS = {
  SCREEN: {
    Z: 700,
  },
  CAR: {
    SENSTIVITY: 3,
  },
  WORLD: {
    FRICTION: 0.1,
  },
  CAMERA: {
    X: 0,
    Y: 0,
    Z: 0,

    speed: 20,
  },
  CAR_SCREEN: {
    Z: 200,
    X: 0,
  },

  ROAD: {
    WIDTH: 1000,
    LENGHT: 100_000,
  },

  UNIVERSAL_PALETTE: [
    "#FFFACDAA",
    "#27AE60AA",
    "#F1C40FAA",
    "#9B59B6AA",
    "#3498DBAA",
    "#E67E22AA",
    "#95A5A6AA",
  ],
};

const gameState = {
  deviation: null,
  center: null,
  environments: [],
  roadBars: [],
  car: null,
  highway: null,
  ground: null,
  sun: null,
  citizens: [],
};
let camera;

function setup() {
  createCanvas(windowWidth, windowHeight);

  gameState.center = createVector(0, 0, 0);
  // gameState.deviation = createVector(0, 0, 0);

  gameState.car = createCar(
    WORLD_CONSTANTS.CAR_SCREEN.X,
    100,
    WORLD_CONSTANTS.CAR_SCREEN.Z,
    50,
    50,
    120,
  );
  gameState.citizens = createOtherCars(10);
  createEnvironment(gameState);
  const shape = new Cube();
  const center = createVector(
    WORLD_CONSTANTS.CAMERA.X,
    100,
    WORLD_CONSTANTS.CAMERA.Z,
  );

  camera = {
    points: createVector(0, -100, -1000),
    rotate: createVector(radians(20), radians(0), radians(0)),
  };
}

const setBackgrounds = () => {
  background(220);
};

const rotateInAxis = (point, angle, fromAxis = "x", toAxis = "y") => {
  let c = cos(angle);
  let s = sin(angle);

  let fromAxisPoint = point[fromAxis] * c - point[toAxis] * s;
  let toAxisPoint = point[fromAxis] * s + point[toAxis] * c;

  return [fromAxisPoint, toAxisPoint];
};

const rotateVertices = (point, rotations) => {
  let newX, newY, newZ;
  let dx = 0, dy = 0, dz = 0;

  [newY, newZ] = rotateInAxis(point, rotations.x, "y", "z");
  dy += newY - point.y;
  dz += newZ - point.z;

  [newZ, newX] = rotateInAxis(point, rotations.y, "z", "x");
  dx += newX - point.x;
  dz += newZ - point.z;

  [newX, newY] = rotateInAxis(point, rotations.z, "x", "y");
  dx += newX - point.x;
  dy += newY - point.y;

  point.x = point.x + dx;
  point.y = point.y + dy;
  point.z = point.z + dz;
  return point;
};

const shapeFromCamera = (shape, camera) => {
  const worldPoints = shape.points.map((point) =>
    p5.Vector.sub(point, camera.points)
  );
  const points = worldPoints.map((point) => {
    const nPoint = point.copy();
    const rotated = rotateVertices(nPoint, camera.rotate);
    return rotated;
  });

  return { ...shape, points };
};

const renderShapes = (shapes, camera) => {
  const shapesFromCamera = shapes.map((shape) =>
    shapeFromCamera(shape, camera)
  );

  const shapesWithDetials = shapesFromCamera.map((shape) =>
    shapeWithDetails(shape)
  );

  const clippedShapes = shapesWithDetials.map((shape) => clipFace(shape));
  const visibleShapes = getVisibleFaces(clippedShapes);
  const sortedFaces = getSortedFaces(visibleShapes);
  const projections = shapesProjections(sortedFaces);

  projections.forEach((projection) => drawFace(projection));
};

const createShape = (points, color = "black", strokeColor = "red") => {
  return { points, color, strokeColor };
};

const handleCamera = () => {
  const diff = p5.Vector.sub(gameState.car.pos, camera.points);
  const camera_car_gap = createVector(0, 100, 250);

  if (diff.z > camera_car_gap.z + 15) {
    camera.points.z += diff.z / 20;
  } else if (diff.z > camera_car_gap.z) {
    camera.points.z = gameState.car.pos.z - camera_car_gap.z;
  }

  if (!nearlyEqual(Math.abs(diff.x), camera_car_gap.x, 2)) {
    camera.points.x += diff.x / 5;
  }
};

const renderCars = () => {
  const playerCarShapes = gameState.car.shape.getFaces();
  const citizensCarShapes = gameState.citizens.flatMap((car) =>
    car.shape.getFaces()
  );

  const carShapes = [...playerCarShapes, ...citizensCarShapes];

  renderShapes(carShapes, camera);
};

function draw() {
  translate(width / 2, height / 2);

  handleCamera();
  updateCitizenCar();
  gameState.car.update();
  renderEnvirnment(gameState.environments, camera);

  renderCars();
  metaData();
}
