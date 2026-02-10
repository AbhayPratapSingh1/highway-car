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

const handlerXMovement = () => {
  const carX = WORLD_CONSTANTS.CAR.X;
  const offsetX = WORLD_CONSTANTS.CAMERA.vOffsetX;
  const car = gameState.car;
  const changeInX = car.pos.x - gameState.center.x;
  console.log(round(changeInX, 0), round(car.pos.x, 0), gameState.center.x);

  if (changeInX > offsetX) {
    const delta = changeInX - (offsetX - 1);
    // moveWorldBackword(delta, "x");
  } else if (changeInX > 0) {
    const delta = changeInX / 20;
    // moveWorldBackword(delta, "x");
  }
};

const updateCitizenCar = () => {
  gameState.citizens.forEach((car) => car.update());
};

const updateCar = () => {
  const car = gameState.car;
  car.update();
  handlerZMovement();
  handlerXMovement();
  updateCitizenCar();
};
