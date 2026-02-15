const createOptions = (options) => {
  const rectHeight = 50;
  const topLen = options.length * rectHeight / 2;
  options.forEach((option, i) => {
    option.y = (rectHeight + 20) * i - topLen - 25;
    option.x = -option.name.length * 15;
    option.w = option.name.length * 30;
    option.h = rectHeight;
  });
  return options;
};

const startGameOptions = createOptions([
  {
    name: "Normal",
    action: () => {
      startNewGame();
      gameState.mode = "race";
    },
  },
  {
    name: "Infinity Run",
    action: () => {
      gameState.mode = "INFINITY";

      startNewGame();
    },
  },
]);

const MOUSE_CALLBACK_OPTIONS = {
  "home": startGameOptions,
};

function mousePressed() {
  const options = MOUSE_CALLBACK_OPTIONS[gameState.state];
  if (options) {
    options.forEach((option) => {
      const x = option.x + width / 2;
      const y = option.y + height / 2;

      const isInX = isBetween(x, mouseX, x + option.w);
      const isIny = isBetween(y, mouseY, y + option.h);
      if (isInX && isIny) {
        option.action();
      }
    });
  }
}

const showMouseCallbackOption = () => {
  const options = MOUSE_CALLBACK_OPTIONS[gameState.state];
  if (options) {
    push();

    textSize(30);
    textAlign("center", "center");

    options.forEach((option) => {
      fill(10, 200);
      rect(option.x, option.y, option.w, option.h, 10, 10, 10, 10);
      fill("white");
      text(option.name, 0, option.y + 25);
    });
    pop();
  }
};
