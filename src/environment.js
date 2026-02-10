// @ts-nocheck

const createHighway = () => {
  return new Cube(
    0,
    100,
    WORLD_CONSTANTS.ROAD.LENGHT / 2,
    10,
    WORLD_CONSTANTS.ROAD.WIDTH,
    WORLD_CONSTANTS.ROAD.LENGHT,
    [[40, 40, 40]],
    [0, 0, 0, 0],
  );
};

const createGround = () => {
  return new Cube(
    0,
    100,
    5000,
    10,
    WORLD_CONSTANTS.ROAD.LENGHT,
    WORLD_CONSTANTS.ROAD.LENGHT,
    ["#388E3C"],
    [0, 0, 0, 0],
  );
};
