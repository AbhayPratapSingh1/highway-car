const renderUI = () => {
  const allCarsParts = [
    ...gameState.citizens.map((each) => each.shape),
    gameState.car.shape,
  ];
  drawCars(allCarsParts);
};

const setBackground = () => {
  background("#4A90E2");
  drawEnvironment();
  drawSun();
};

const metaData = () => {
  push();
  noStroke();
  fill(0);
  translate(-width / 2, -height / 2);
  text(`FPS : ${Math.floor(frameRate())}`, width - 150, 60);
  pop();
};
