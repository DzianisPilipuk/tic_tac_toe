const gameboard = (() => {
  const gameboardState = [];
  const gameboardCells = document.getElementById("gameboard").children;
  for (let i = 0; i < gameboardCells.length; i += 1) {
    gameboardCells[i].addEventListener("click", () => {
      gameController.playRound(i);
    });
  }

  const addElement = (element, cell) => {
    gameboardState[cell] = element;
  };

  const renderGameboard = () => {
    for (let i = 0; i < 9; i += 1) {
      gameboardCells[i].textContent = gameboardState[i];
    }
  };

  const clearGameboard = () => {
    gameboardState.length = 0;
    renderGameboard();
  };

  return { addElement, renderGameboard, gameboardState, clearGameboard };
})();

const players = [];

const playerFactory = (team) => {
  const playerTeam = team;
  const makeMove = (cell) => {
    gameboard.addElement(playerTeam, cell);
  };
  const returnObject = { makeMove };
  players.push(returnObject);
  return returnObject;
};

playerFactory("X");
playerFactory("O");

const gameController = (() => {
  let lastPlayer;
  let boardIsLocked = true;
  let isTie;
  let winner;

  const currentplayer = () => {
    if (lastPlayer === players.length - 1 || lastPlayer === undefined) {
      lastPlayer = 0;
      return players[0];
    }
    lastPlayer += 1;
    return players[lastPlayer];
  };

  const declareGameFinish = () => {
    const gameOverScreen = document.getElementById("game_over_screen");
    const gameResultDisplay = document.getElementById("game_result_display");
    let gameResult;
    boardIsLocked = true;
    if (isTie) {
      gameResult = "it's a tie";
    } else {
      gameResult = `${winner} wins`;
    }
    gameOverScreen.style.visibility = "visible";
    gameResultDisplay.textContent = gameResult;
  };

  const checkAllFieldsAreOccupied = () => {
    let freeFieldsLeft = false;
    for (let i = 0; i < 9; i += 1) {
      if (gameboard.gameboardState[i] === undefined) freeFieldsLeft = true;
    }
    if (freeFieldsLeft) return false;
    return true;
  };

  const checkWinningPattern = (a, b, c) => {
    const { gameboardState } = gameboard;
    if (
      gameboardState[a] === gameboardState[b] &&
      gameboardState[a] === gameboardState[c] &&
      gameboardState[a] !== undefined
    ) {
      winner = gameboardState[a];
      declareGameFinish();
    }
  };

  const checkGameIsFinished = () => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    winningPatterns.forEach((pattern) => checkWinningPattern(...pattern));
    if (checkAllFieldsAreOccupied()) {
      isTie = true;
      declareGameFinish();
    }
  };

  const playRound = (cell) => {
    if (
      gameboard.gameboardState[cell] === undefined &&
      boardIsLocked === false
    ) {
      currentplayer().makeMove(cell);
      gameboard.renderGameboard();
      checkGameIsFinished();
    }
  };

  const reset = () => {
    boardIsLocked = false;
    lastPlayer = players.length - 1;
    isTie = false;
  };

  const unlockGameboard = () => {
    boardIsLocked = false;
  };

  return { playRound, reset, unlockGameboard };
})();

const startButton = document.getElementById("start_button");
startButton.addEventListener("click", () => {
  document.getElementById("start_game_screen").style.visibility = "hidden";
  gameController.unlockGameboard();
});

const restartButton = document.getElementById("restart_button");
restartButton.addEventListener("click", () => {
  gameController.reset();
  gameboard.clearGameboard();
  document.getElementById("game_over_screen").style.visibility = "hidden";
});
