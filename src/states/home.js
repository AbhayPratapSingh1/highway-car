const home = () => {
  renderHero();
  // either click using mouse or press enter
  showMouseCallbackOption();
  if (keyIsDown(ENTER) && millis() - time > 300) {
    gameState.state = "play";
    startNewGame();
    time = millis();
  }
};

