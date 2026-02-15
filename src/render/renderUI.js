// @ts-nocheck
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

const renderEnvirnmentShapes = (shapes, camera) => {
  const shapesFromCamera = shapes.map((shape) =>
    shapeFromCamera(shape, camera)
  );

  const shapesWithDetials = shapesFromCamera.map((shape) =>
    shapeWithDetails(shape)
  );

  const clippedShapes = shapesWithDetials.map((shape) => clipFace(shape));
  const visibleShapes = getVisibleFaces(clippedShapes);
  const projections = shapesProjections(visibleShapes);
  return projections;
};

const renderEnvirnment = (environments, camera) => {
  const shapes = environments.flatMap((each) => each.getFaces());
  return renderEnvirnmentShapes(shapes, camera);
};

const renderView = (environments, camera) => {
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
  const size = 0.5;
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
  return projections;
  projections.forEach((projection) => drawFace(projection));
};

const renderCars = (gameState, camera) => {
  const playerCarShapes = gameState.car.shape.getFaces();
  const citizensCarShapes = gameState.citizens.flatMap((car) =>
    car.shape.getFaces()
  );

  const carShapes = [...playerCarShapes, ...citizensCarShapes];
  return renderShapes(carShapes, camera);
};

const metaData = () => {
  push();
  noStroke();
  fill(0);
  textSize(14);
  translate(-width / 2, -height / 2);
  text(`FPS : ${Math.floor(frameRate())}`, width - 150, 60);
  pop();
  gameState.framesRendered += frameRate();
  console.log("AVG FPS:", round(gameState.framesRendered / gameState.count));
};

const showScreens = () => {
  const toDrawParts = [];
  switch (mode) {
    case -1: {
      const faces = renderEnvirnment(gameState.environments, gameState.camera);
      const carPoints = renderCars(gameState, gameState.camera);
      toDrawParts.push(faces, carPoints);
      break;
    }
    default: {
      const oppoFaces = renderEnvirnment(
        gameState.environments,
        gameState.views[mode],
      );
      const carOppoFaces = renderCars(gameState, gameState.views[mode]);

      toDrawParts.push(oppoFaces, carOppoFaces);
    }
  }

  toDrawParts.forEach((faces) => faces.forEach((face) => drawFace(face)));
};
