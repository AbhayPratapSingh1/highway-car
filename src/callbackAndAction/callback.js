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
    name: "Start Game",
    action: () => {
      gameState.state = "play";
    },
  },
  { name: "Exit", action: () => gameState.state = "exit" },
]);

const pauseOptions = createOptions([
  { name: "Resume", action: () => gameState.state = "play" },
  { name: "Home", action: () => {} },
]);

const gameOverOption = createOptions([
  { name: "Home", action: () => {} },
]);

const MOUSE_CALLBACK_OPTIONS = {
  "home": startGameOptions,
  "pause": pauseOptions,
  "game-over": gameOverOption,
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
    translate(width / 2, height / 2);

    textSize(30);
    textAlign("center", "center");

    options.forEach((option) => {
      fill("white");
      text(option.name, 0, option.y + 25);
      fill(255, 60);

      rect(option.x, option.y, option.w, option.h, 10, 10, 10, 10);
    });
    pop();
  }
};
