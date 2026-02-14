/// <reference types="p5/global"/>
// @ts-nocheck

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
  camera: null,
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  gameState.center = createVector(0, 0, 0);

  gameState.car = createCar();
  const count = random(10);
  gameState.citizens = createOtherCars(count);

  createEnvironment(gameState);

  gameState.camera = createCamera();
}


function draw() {
  translate(width / 2, height / 2);

  handleCamera();
  update();

  setBackgrounds();

  renderEnvirnment(gameState.environments, gameState.camera);

  renderCars(gameState);
  metaData();
}
