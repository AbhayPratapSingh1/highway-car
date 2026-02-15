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
  startNewGame();
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

let time = 0;
const home = () => {
  renderHero();

  // either click using mouse or press enter
  showMouseCallbackOption();
  if (keyIsDown(ENTER) && millis() - time > 300) {
    gameState.state = "play";
    startNewGame();
    time = millis();
  }
};

const finished = () => {
  renderHero();
  fill("#EFBF0455");
  rect(-width / 2, -100, width, 200);
  textSize(70);
  textAlign("center", "center");
  textWidth(10);
  fill("black");
  text("Congratulation!!\n You finished the race", 0, 0);

  showMouseCallbackOption();
  if (keyIsDown(ENTER)) {
    gameState.state = "home";
    gameState.count = 1;
    gameState.framesRendered = 0;
    time = millis();
  }
};

const play = () => {
  if (gameState.mode === "race") {
    if (gameState.car.pos.z >= CONFIG.ROAD.LENGHT - 100) {
      gameState.state = "finished";
    }
  }
  if (gameState.mode === "INFINITY") {
    if (gameState.car.pos.z >= gameState.road.center.z) {
      gameState.environments.forEach((shape) => {
        shape.points.forEach((point) => {
          point.z += CONFIG.ROAD.LENGHT / 3;
        });
        shape.center.z += CONFIG.ROAD.LENGHT / 3;
      });
    }
  }

  handleCamera();
  update();

  handleModes();
  showScreens();
  metaData();
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
