let time = 0;

const finished = () => {
  renderHero();
  fill("#EFBF0455");
  rect(-width / 2, -100, width, 200);
  textSize(70);
  textAlign("center", "center");
  fill("black");
  text("Congratulation!!\n You finished the race", 0, 0);

  showMouseCallbackOption();
  if (keyIsDown(ENTER)) {
    gameState.state = "home";
    gameState.count = 1;
    gameState.framesRendered = 0;
    time = millis();
  }
};
