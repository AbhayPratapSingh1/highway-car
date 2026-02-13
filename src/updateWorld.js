const moveWorldBackword = (
  delta = WORLD_CONSTANTS.CAR.SENSTIVITY,
  axis = "z",
) => {
  const toUpdate = [
    ...gameState.environments,
    ...gameState.citizens.map((each) => each.shape),
  ];
  for (const entitiy of toUpdate) {
    entitiy.pos[axis] -= delta;
    entitiy.points.forEach((point) => point[axis] -= delta);
  }

  gameState.car.pos[axis] -= delta;
  gameState.car.shape.points.forEach((point) => point[axis] -= delta);
};

const handlerZMovement = () => {
  const carZ = WORLD_CONSTANTS.CAR.Z;
  const offsetZ = WORLD_CONSTANTS.CAMERA.vOffsetZ;
  const car = gameState.car;

  if (car.pos.z - gameState.center.z > carZ + offsetZ) {
    const delta = car.pos.z - (carZ + offsetZ - 2);
    moveWorldBackword(delta);
  } else if (car.pos.z - gameState.center.z > carZ) {
    const delta = (car.pos.z - carZ) / 20;
    moveWorldBackword(delta);
  }
};

const nearlyEqual = (a, b, delta = 0.001) => {
  return Math.abs(a - b) < delta;
};

const handlerXMovement = () => {
  const car = gameState.car;

  if (!nearlyEqual(WORLD_CONSTANTS.CAMERA.X, car.pos.x, 5)) {
    const delta = (car.pos.x - WORLD_CONSTANTS.CAMERA.X) / 20;
    moveWorldBackword(delta, "x");
  }
};

const updateCitizenCar = () => {
  gameState.citizens.forEach((car) => car.update());
};

const update = () => {
  const car = gameState.car;
  car.update();
  updateCitizenCar();

  handlerZMovement();
  handlerXMovement();
};
