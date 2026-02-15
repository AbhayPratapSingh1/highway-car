// @ts-nocheck

const createHighway = (environments) => {
  const l = WORLD_CONSTANTS.ROAD.LENGHT;
  const w = WORLD_CONSTANTS.ROAD.WIDTH;
  const color = [40, 40, 40];
  const stroke = [0, 0, 0, 0];

  const shape = createStaticShape(0, 100, l / 2, w, 10, l, color, stroke);

  environments.push(shape);
};

const createGround = (environments) => {
  const l = WORLD_CONSTANTS.ROAD.LENGHT;
  const w = WORLD_CONSTANTS.ROAD.LENGHT;
  const color = "#388E3C";
  const stroke = [0, 0, 0, 0];

  const shape = createStaticShape(0, 100, l / 2, w, 10, l, color, stroke);

  environments.push(shape);
};

const createBars = (environments) => {
  for (let z = 20; z < WORLD_CONSTANTS.ROAD.LENGHT; z += 250) {
    const bar = createRoadBar(0, 100, z);
    environments.push(bar);
  }
  return environments;
};

const createStaticShape = (x, y, z, w = 10, h = 1, d = 100, color, stroke) => {
  const w2 = w / 2;
  const h2 = h / 2;
  const d2 = d / 2;
  const center = createVector(x, y, z);

  const p1 = createVector(-w2, -h2, -d2).add(center); // (F-L-T)
  const p2 = createVector(+w2, -h2, -d2).add(center); // (F-R-T)
  const p3 = createVector(+w2, -h2, +d2).add(center); // (B-R-T)
  const p4 = createVector(-w2, -h2, +d2).add(center); // (B-L-T)

  const face = {
    points: [p1, p2, p3, p4],
    storkeColor: stroke,
    color,
  };

  return {
    // points: [p1, p2, p3, p4],
    getFaces: () => face,
    pos: createVector(x, y, z),
  };
};

const createRoadBar = (x, y, z, w = 10, h = 1, d = 100) => {
  return createStaticShape(x, y, z, w, h, d, "white", "black");
};
