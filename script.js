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

const minimax = (currentGameboardState, team) => {
  const posibleMoves = [];
  const availableFields = [];
  for (let i = 0; i < 9; i += 1) {
    if (currentGameboardState[i] === undefined) {
      availableFields.push(i);
    }
  }
  for (let i = 0; i < availableFields.length; i += 1) {
    const currentMove = {};
    currentMove.index = availableFields[i];
    currentGameboardState[availableFields[i]] = team;
    const gameboardStateParameters = gameController.checkTerminalState(
      currentGameboardState
    );
    if (gameboardStateParameters.winner === "X") currentMove.result = 1;
    if (gameboardStateParameters.winner === "O") currentMove.result = -1;
    if (gameboardStateParameters.isTie) currentMove.result = 0;
    if (currentMove.result === undefined) {
      let opponent = "X";
      if (team === "X") opponent = "O";
      currentMove.result = minimax(currentGameboardState, opponent).result;
    }
    currentGameboardState[availableFields[i]] = undefined;
    posibleMoves.push(currentMove);
    if (
      (team === "X" && currentMove.result === 1) ||
      (team === "O" && currentMove.result === -1)
    )
      break;
  }
  let bestMove;
  for (let i = 0; i < posibleMoves.length; i += 1) {
    if (
      (team === "X" && posibleMoves[i].result > bestMove?.result) ||
      bestMove === undefined
    ) {
      bestMove = posibleMoves[i];
    }
    if (
      (team === "O" && posibleMoves[i].result < bestMove?.result) ||
      bestMove === undefined
    ) {
      bestMove = posibleMoves[i];
    }
  }
  return bestMove;
};

const AI = (intelligence) => {
  let isSmart = false;
  if (intelligence > Math.floor(Math.random() * 100)) isSmart = true;
  console.log(isSmart);
  gameController.lockGameboard();
  const delay = 200;
  let AIchoice;
  if (isSmart) {
    AIchoice = minimax(
      gameboard.gameboardState,
      gameController.getCurrentPlayerTeam()
    ).index;
  }
  if (!isSmart) {
    do {
      AIchoice = Math.floor(Math.random() * 9);
    } while (gameboard.gameboardState[AIchoice] !== undefined);
  }
  setTimeout(() => {
    gameController.unlockGameboard();
    gameController.playRound(AIchoice);
  }, delay);
};

const gameController = (() => {
  let boardIsLocked = true;
  let stateParameters;
  let currentPlayerIndex = 0;
  let AIIntelligence;

  const players = [];

  const playerFactory = (team, isHuman = true) => {
    const returnObject = { team, isHuman };
    players.push(returnObject);
    return returnObject;
  };

  const getCurrentPlayerTeam = () => players[currentPlayerIndex].team;

  const passTurn = () => {
    if (currentPlayerIndex === players.length - 1) {
      currentPlayerIndex = 0;
    } else {
      currentPlayerIndex += 1;
    }
    if (players[currentPlayerIndex].isHuman !== true) {
      AI(AIIntelligence);
    }
  };

  const declareGameFinish = () => {
    const gameOverScreen = document.getElementById("game_over_screen");
    const gameResultDisplay = document.getElementById("game_result_display");
    let gameResult = `${stateParameters.winner} wins`;
    boardIsLocked = true;
    if (stateParameters.isTie) gameResult = "it's a tie";
    gameOverScreen.style.visibility = "visible";
    gameResultDisplay.textContent = gameResult;
  };

  const checkAllFieldsAreOccupied = (gameboardState) => {
    for (let i = 0; i < 9; i += 1) {
      if (gameboardState[i] === undefined) return false;
    }
    return true;
  };

  const checkWinningPattern = (gameboardState, a, b, c) => {
    if (
      gameboardState[a] === gameboardState[b] &&
      gameboardState[a] === gameboardState[c] &&
      gameboardState[a] !== undefined
    ) {
      return gameboardState[a];
    }
    return false;
  };

  const checkTerminalState = (gameboardState) => {
    const stateParameters = {};
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
    for (let i = 0; i < winningPatterns.length; i += 1) {
      const tmp = checkWinningPattern(gameboardState, ...winningPatterns[i]);
      if (tmp) {
        stateParameters.winner = tmp;
        return stateParameters;
      }
    }
    stateParameters.isTie = checkAllFieldsAreOccupied(gameboardState);
    return stateParameters;
  };

  const checkGameIsFinished = (gameboardState) => {
    stateParameters = checkTerminalState(gameboardState);
    if (stateParameters.isTie || stateParameters.winner) declareGameFinish();
  };

  const playRound = (cell) => {
    if (
      gameboard.gameboardState[cell] === undefined &&
      boardIsLocked === false
    ) {
      gameboard.addElement(players[currentPlayerIndex].team, cell);
      gameboard.renderGameboard();
      checkGameIsFinished(gameboard.gameboardState);
      if (!stateParameters.isTie && !stateParameters.winner) {
        passTurn();
      }
    }
  };

  const reset = () => {
    boardIsLocked = false;
    currentPlayerIndex = 0;
    stateParameters = {};
  };

  const unlockGameboard = () => {
    boardIsLocked = false;
  };

  const lockGameboard = () => {
    boardIsLocked = true;
  };

  const startGame = () => {
    const playerXIsHuman = document.getElementById("player_X_isHuman").checked;
    const playerOIsHuman = document.getElementById("player_O_isHuman").checked;
    AIIntelligence = document.getElementById("AI_intelligence").value;

    playerFactory("X", playerXIsHuman);
    playerFactory("O", playerOIsHuman);

    if (playerXIsHuman === false) {
      AI(AIIntelligence);
    }
  };

  return {
    playRound,
    reset,
    unlockGameboard,
    lockGameboard,
    startGame,
    checkTerminalState,
    getCurrentPlayerTeam,
  };
})();

const startButton = document.getElementById("start_button");
startButton.addEventListener("click", () => {
  document.getElementById("start_game_screen").style.visibility = "hidden";
  gameController.unlockGameboard();
  gameController.startGame();
});

const restartButton = document.getElementById("restart_button");
restartButton.addEventListener("click", () => {
  gameController.reset();
  gameboard.clearGameboard();
  document.getElementById("game_over_screen").style.visibility = "hidden";
  gameController.startGame();
});
