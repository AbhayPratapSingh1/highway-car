const handleModes = () => {
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
};

const play = () => {
  handleModes();
  handleCamera();
  update();

  handleViewModes();
  showScreens();
  metaData();
};
