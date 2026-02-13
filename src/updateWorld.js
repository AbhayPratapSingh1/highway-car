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
  }
};

const cameraZMovement = () => {
  const carZ = WORLD_CONSTANTS.CAR_SCREEN.Z;
  const car = gameState.car.shape;

  const cameraMovementSpeed = WORLD_CONSTANTS.CAMERA.speed;
  const center = gameState.center;
  const diff = car.pos.z - center.z;

  if (diff > carZ) {
    const delta = (car.pos.z - center.z - carZ) / cameraMovementSpeed;
    moveWorldBackword(delta);
    gameState.car.pos.z -= delta;
  }
};

const nearlyEqual = (a, b, delta = 0.001) => {
  return Math.abs(a - b) < delta;
};

const cameraXMovement = () => {
  const carX = WORLD_CONSTANTS.CAR_SCREEN.X;
  const car = gameState.car.shape;
  const cameraMovementSpeed = WORLD_CONSTANTS.CAMERA.speed;
  const center = gameState.center;
  const diff = car.pos.x - center.x;

  if (Math.abs(diff) > carX) {
    const delta = (car.pos.x - center.x - carX) / cameraMovementSpeed;
    moveWorldBackword(delta, "x");
    gameState.car.pos.x -= delta;
  }
};

const updateCitizenCar = () => {
  gameState.citizens.forEach((car) => car.update());
};

const update = () => {
  const car = gameState.car;
  car.update();

  updateCitizenCar();
  cameraZMovement();
  cameraXMovement();
};
