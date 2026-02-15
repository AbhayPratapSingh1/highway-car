// @ts-nocheck
const createCamera = () => {
  const { x, y, z, rx, ry, rz } = CAMERA_CONFIGURATION;
  return {
    points: createVector(x, y, z),
    rotate: createVector(radians(rx), radians(ry), radians(rz)),
    update: () => {
      // find the change inthe car and in the camera points
      const diff = p5.Vector.sub(gameState.car.pos, gameState.camera.points);
      const camera_car_gap = createVector(0, 100, 250);

      // while the difference is higher than the 15 pixeld update the camera by some ratio toward the car
      if (diff.z > camera_car_gap.z + 15) {
        gameState.camera.points.z += diff.z / 20;
      } else if (diff.z > camera_car_gap.z) {
        gameState.camera.points.z = gameState.car.pos.z - camera_car_gap.z;
      }

      if (!nearlyEqual(Math.abs(diff.x), camera_car_gap.x, 2)) {
        gameState.camera.points.x += diff.x / 5;
      }
    },
  };
};

const carSideView = (sideOffset = 1, hOff = 0.5, dOff = 0) => {
  const { x, y, z, rx, ry, rz } = CAMERA_CONFIGURATION;
  const car = CAR_CONFIGURATION;

  const points = createVector(
    car.x - gameState.car.shape.w * sideOffset,
    car.y - gameState.car.shape.h * hOff,
    car.z - gameState.car.shape.d * dOff,
  );
  return {
    points,
    rotate: createVector(radians(0), radians(0), radians(0)),
    update: () => {
      points.x = gameState.car.pos.x - gameState.car.shape.w * sideOffset;
      points.y = gameState.car.pos.y - gameState.car.shape.h * hOff;
      points.z = gameState.car.pos.z - gameState.car.shape.d * dOff;
    },
  };
};

const carSideBackView = (sideOffset = 1, hOff = 0.5, dOff = 0) => {
  const { x, y, z, rx, ry, rz } = CAMERA_CONFIGURATION;
  const car = CAR_CONFIGURATION;

  const points = createVector(
    car.x - gameState.car.shape.w * sideOffset,
    car.y - gameState.car.shape.h * hOff,
    car.z - gameState.car.shape.d * dOff,
  );
  return {
    points,
    rotate: createVector(radians(0), radians(180), radians(0)),
    update: () => {
      points.x = gameState.car.pos.x - gameState.car.shape.w * sideOffset;
      points.y = gameState.car.pos.y - gameState.car.shape.h * hOff;
      points.z = gameState.car.pos.z - gameState.car.shape.d * dOff;
    },
  };
};

const createBackView = (zOff = 1000) => {
  const { x, y, z, rx, ry, rz } = CAMERA_CONFIGURATION;
  const points = createVector(x, y, z);
  console.log(gameState.car.pos.x);
  return {
    points,
    rotate: createVector(radians(rx - 30), radians(ry - 180), radians(rz)),

    update: () => {
      points.x = gameState.camera.points.x;
      points.y = gameState.camera.points.y;
      points.z = gameState.camera.points.z + zOff;
    },
  };
};
const createView = () => {
  const views = [
    carSideView(1, 0.5, 0.2),
    carSideView(-1, 0.5, 0.2),
    createBackView(),
    carSideBackView(1, 0.5, -0.5),
    carSideBackView(-1, 0.5, -0.5),
  ];
  return views;
};

const createEnvironment = (gameState) => {
  createGround(gameState.environments);
  createHighway(gameState.environments);
  createBars(gameState.environments);
};

const createOtherCars = (count = 2, from = -400, to = 10000) => {
  const cars = [];

  const w2 = WORLD_CONSTANTS.ROAD.WIDTH / 2;

  for (let i = 0; i < count; i++) {
    const x = random(-w2, w2);
    const y = 100;
    const z = random(from, to);

    const h = 50;
    const w = 50;
    const l = 80;

    cars.push(createCitizenCar(x, y, z, h, w, l));
  }

  cars.sort((a, b) => b.pos.z - a.pos.z);
  return cars;
};
