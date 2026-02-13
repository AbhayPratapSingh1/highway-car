const createBars = () => {
  const bars = [];
  for (let z = 20; z < WORLD_CONSTANTS.ROAD.LENGHT; z += 250) {
    const bar = createRoadBar(0, 110, z);
    bars.push(bar);
  }
  return bars;
};

const createRoadBar = (x, y, z, w = 10, h = 1, d = 100) => {
  const bar = new Cube(x, y, z, h, w, d, ["white"], "black");
  return bar;
};

const createEnvironment = (gameState) => {
  const highway = createHighway();
  const ground = createGround();
  const bars = createBars();

  gameState.environments.push(ground, highway, ...bars);
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
