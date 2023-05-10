const gameboard = (() => {
  const gameboardState = [];
  const gameboardCells = document.getElementById("gameboard").children;
  for (let i = 0; i < gameboardCells.length; i++) {
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
  const getGameboardState = () => [...gameboardState];
  return { addElement, renderGameboard, getGameboardState };
})();

const playerFactory = (team) => {
  const playerTeam = team;
  const makeMove = (cell) => {
    gameboard.addElement(playerTeam, cell);
  };
  return { makeMove };
};

const player1 = playerFactory("X");

const gameController = (() => {
  let currentplayer = player1;
  let gameIsFinished = false;
  const checkGameIsFinished = () => {
    const checkWinningPattern = (a, b, c) => {
      const gameboardState = gameboard.getGameboardState();
      if (
        gameboardState[a] === gameboardState[b] &&
        gameboardState[a] === gameboardState[c] &&
        gameboardState[a] !== undefined
      ) {
        console.log("gameover");
        gameIsFinished = true;
      }
    };
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
  };
  const playRound = (cell) => {
    currentplayer.makeMove(cell);
    gameboard.renderGameboard();
    checkGameIsFinished();
  };
  return { playRound };
})();
