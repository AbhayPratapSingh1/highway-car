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

const renderEnvirnment = (environments, camera) => {
  const shapes = environments.flatMap((each) => each.getFaces());
  const shapesFromCamera = shapes.map((shape) =>
    shapeFromCamera(shape, camera)
  );

  const shapesWithDetials = shapesFromCamera.map((shape) =>
    shapeWithDetails(shape)
  );

  const clippedShapes = shapesWithDetials.map((shape) => clipFace(shape));
  const visibleShapes = getVisibleFaces(clippedShapes);
  const projections = shapesProjections(visibleShapes);

  background(135, 206, 235);
  projections.forEach((projection) => drawFace(projection));
};
