const drawSun = () => {
  fill("yellow");
  circle(-width / 2 + 100, -height / 2 + 100, 100);
};

const drawEnvironment = () => {
  const faces = getAllFacesWithDetail(gameState.environments);
  const clippedFaces = faces.map((face) => clipFace(face)).filter((each) =>
    each.points.length > 0
  );

  const visibleFaces = getVisibleFaces(clippedFaces);
  const toDraw = shapesProjections(visibleFaces);

  toDraw.forEach((face) => {
    drawFace(face);
  });
};

const drawCar = () => {
  const environment = [gameState.car.shape];
  const faces = getAllFacesWithDetail(environment);
  const clippedFaces = faces.map((face) => clipFace(face)).filter((each) =>
    each.points.length > 0
  );

  const visibleFaces = getVisibleFaces(clippedFaces);
  const toDraw = shapesProjections(visibleFaces);

  toDraw.forEach((face) => {
    drawFace(face);
  });
};

const drawCitizens = () => {
  const environment = gameState.citizens.map((car) => car.shape);
  const faces = getAllFacesWithDetail(environment);
  const clippedFaces = faces.map((face) => clipFace(face)).filter((each) =>
    each.points.length > 0
  );

  const visibleFaces = getVisibleFaces(clippedFaces);
  const toDraw = shapesProjections(visibleFaces);

  toDraw.forEach((face) => {
    drawFace(face);
  });
};
