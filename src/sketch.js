/// <reference types="p5/global"/>
// @ts-nocheck

const gameState = {
  deviation: null,
  center: null,
  environments: [],
  roadBars: [],
  allCars: [],
  car: null,
  highway: null,
  ground: null,
  sun: null,
  citizens: [],
  camera: null,
  views: [],
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  gameState.center = createVector(0, 0, 0);

  gameState.car = createCar();

  gameState.citizens = createOtherCars(50, 100, 100000);
  gameState.allCars = [...gameState.citizens, gameState.car];

  createEnvironment(gameState);

  gameState.camera = createCamera();

  gameState.views = createView();
}

let mode = -1;
let s = 0;
let resetsIn = 0;



function draw() {
  translate(width / 2, height / 2);
  background("#4A90E2");

  handleCamera();
  update();

  handleModes();
  showScreens();
  metaData();

  
  // noLoop();
}
