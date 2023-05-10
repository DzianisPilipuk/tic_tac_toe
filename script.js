const gameboard = (() => {
  let gameboardState = [];
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
    gameboardState = [];
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
  const currentplayer = () => {
    if (lastPlayer === players.length - 1 || lastPlayer === undefined) {
      lastPlayer = 0;
      return players[0];
    }
    lastPlayer += 1;
    return players[lastPlayer];
  };
  function checkGameIsFinished() {
    function declareGameFinish(statement) {
      alert(statement);
    }
    function checkAllFieldsAreOccupied() {
      let freeFieldsLeft = false;
      for (let i = 0; i < 9; i += 1) {
        if (gameboard.gameboardState[i] === undefined) freeFieldsLeft = true;
      }
      if (freeFieldsLeft) return false;
      return true;
    }
    function checkWinningPattern(a, b, c) {
      const { gameboardState } = gameboard;
      if (
        gameboardState[a] === gameboardState[b] &&
        gameboardState[a] === gameboardState[c] &&
        gameboardState[a] !== undefined
      ) {
        declareGameFinish(`${gameboardState[a]} won`);
      }
    }
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
    if (checkAllFieldsAreOccupied()) declareGameFinish("it's a tie");
  }
  const playRound = (cell) => {
    if (gameboard.gameboardState[cell] === undefined) {
      currentplayer().makeMove(cell);
      gameboard.renderGameboard();
      checkGameIsFinished();
    }
  };
  return { playRound };
})();
