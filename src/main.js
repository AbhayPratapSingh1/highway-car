/// <reference types="p5/global"/>
// @ts-nocheck

const gameState = {
  mode: "race",
  framesRendered: 0,
  count: 1,
  state: "home",
  deviation: null,
  center: null,
  environments: [],

  road: null,
  allCars: [],
  car: null,
  highway: null,
  ground: null,
  sun: null,
  citizens: [],
  camera: null,
  views: [],
};

const startNewGame = () => {
  gameState.state = "play";
  gameState.center = createVector(0, 0, 0);

  gameState.car = createCar();
  gameState.citizens = createOtherCars(50);

  createEnvironment(gameState);

  gameState.camera = createCamera();

  gameState.views = createView();

  gameState.count = 1;
  gameState.framesRendered = 0;
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  createEnvironment(gameState);
}

let mode = -1;

let resetsIn = 0;

const renderHero = () => {
  const environment = renderEnvirnment(
    gameState.environments,
    {
      points: createVector(0, 0, 200),
      rotate: createVector(radians(0), radians(0), radians(0)),
    },
  );

  environment.forEach((face) => drawFace(face));
};

function draw() {
  translate(width / 2, height / 2);
  background("#4A90E2");

  switch (gameState.state) {
    case "home": {
      home();
      break;
    }
    case "play": {
      play();
      break;
    }
    case "finished": {
      finished();
      break;
    }
  }
  gameState.count++;
}
