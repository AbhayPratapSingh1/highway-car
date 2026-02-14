const shapeFromCamera = (shape, camera) => {
  const worldPoints = shape.points.map((point) =>
    p5.Vector.sub(point, camera.points)
  );
  const points = worldPoints.map((point) => {
    const nPoint = point.copy();
    const rotated = rotateVertices(nPoint, camera.rotate);
    return rotated;
  });

  return { ...shape, points };
};

const setBackgrounds = () => {
  background("#4A90E2");
  drawEnvironment();
  // drawSun();
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

  projections.forEach((projection) => drawFace(projection));
};

const renderShapes = (shapes, camera) => {
  const shapesFromCamera = shapes.map((shape) =>
    shapeFromCamera(shape, camera)
  );

  const shapesWithDetials = shapesFromCamera.map((shape) =>
    shapeWithDetails(shape)
  );

  const clippedShapes = shapesWithDetials.map((shape) => clipFace(shape));
  const visibleShapes = getVisibleFaces(clippedShapes);
  const sortedFaces = getSortedFaces(visibleShapes);
  const projections = shapesProjections(sortedFaces);

  projections.forEach((projection) => drawFace(projection));
};

const renderCars = (gameState) => {
  const playerCarShapes = gameState.car.shape.getFaces();
  const citizensCarShapes = gameState.citizens.flatMap((car) =>
    car.shape.getFaces()
  );

  const carShapes = [...playerCarShapes, ...citizensCarShapes];
  renderShapes(carShapes, gameState.camera);
};

const metaData = () => {
  push();
  noStroke();
  fill(0);
  translate(-width / 2, -height / 2);
  text(`FPS : ${Math.floor(frameRate())}`, width - 150, 60);
  pop();
};
