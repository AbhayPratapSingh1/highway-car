// @ts-nocheck
const handleCamera = () => {
  const diff = p5.Vector.sub(gameState.car.pos, gameState.camera.points);
  const camera_car_gap = createVector(0, 100, 250);

  if (diff.z > camera_car_gap.z + 15) {
    gameState.camera.points.z += diff.z / 20;
  } else if (diff.z > camera_car_gap.z) {
    gameState.camera.points.z = gameState.car.pos.z - camera_car_gap.z;
  }

  if (!nearlyEqual(Math.abs(diff.x), camera_car_gap.x, 2)) {
    gameState.camera.points.x += diff.x / 5;
  }

  gameState.views.forEach((view) => {
    view.update();
  });
};

const nearlyEqual = (a, b, delta = 0.001) => {
  return Math.abs(a - b) < delta;
};

const update = () => {
  gameState.car.update();
  gameState.citizens.forEach((car) => car.update());
};

const handleModes = () => {
  if (keyIsDown(66) && resetsIn-- <= 0) {
    mode = mode = (mode + 1) % gameState.views.length;
    resetsIn = 5;
  }

  if (keyIsDown(65)) {
    mode = -1;
  }
};
