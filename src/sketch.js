/// <reference types="p5/global"/>
// @ts-nocheck

const gameState = {
  center: null,
  environments: [],
  roadBars: [],
  car: null,
  highway: null,
  ground: null,
  sun: null,
  citizens: [],
};

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

const createCitizens = (count = 2) => {
  const w2 = WORLD_CONSTANTS.ROAD.WIDTH / 2;

  for (let i = 0; i < count; i++) {
    const x = random(-w2, w2);

    const z = random(500, WORLD_CONSTANTS.ROAD.LENGHT);
    gameState.citizens.push(
      createCitizenCar(x, 100, z, 50, 50, 80, "green", "red"),
    );
  }
  gameState.citizens.sort((a, b) => b.pos.z - a.pos.z);
};

const createEnvironment = (gameState) => {
  const highway = createHighway();
  const ground = createGround();
  const bars = createBars();

  gameState.environments.push(ground, highway, ...bars);
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  gameState.center = createVector(0, 0, 0);
  gameState.car = createCar(20, 100, WORLD_CONSTANTS.CAR.Z, 50, 50, 120);
  createCitizens(100);
  createEnvironment(gameState);
}

const drawCars = (cars) => {
  const faces = getAllFacesWithDetail(cars);
  const clippedFaces = faces.map((face) => clipFace(face)).filter((each) =>
    each.points.length > 0
  );

  const visibleFaces = getVisibleFaces(clippedFaces);
  const sortedFaces = getSortedFaces(visibleFaces);

  const toDraw = getPrintablePoint(visibleFaces);
  toDraw.forEach((face) => {
    drawFace(face);
  });
};

function draw() {
  translate(width / 2, height / 2);
  background("#4A90E2");

  updateCar();

  drawEnvironment();
  drawSun();
  drawCars([
    ...gameState.citizens.map((each) => each.shape),
    gameState.car.shape,
  ]);
  metaData();
}
