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

function setup() {
  createCanvas(windowWidth, windowHeight);
  gameState.center = createVector(0, 0, 0);
  gameState.car = createCar(0, 100, WORLD_CONSTANTS.CAR.Z, 50, 50, 120);
  gameState.citizens = createOtherCars(10);
  createEnvironment(gameState);
}

function draw() {
  translate(width / 2, height / 2);
  setBackground();

  update();

  renderUI();
  metaData();
}
