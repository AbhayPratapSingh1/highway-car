// @ts-nocheck
const handleCamera = () => {
  gameState.camera.update();
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

const handleViewModes = () => {
  if (keyIsDown(66) && resetsIn-- <= 0) {
    mode = mode = (mode + 1) % gameState.views.length;
    resetsIn = 5;
  }

  if (keyIsDown(65)) {
    mode = -1;
  }
};
