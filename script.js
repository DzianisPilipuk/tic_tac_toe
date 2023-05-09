const gameboard = (() => {
  const gameboardState = ["X", "X", "X", "X"];
  const gameboardCells = document.getElementById("gameboard").children;
  const addElement = (element, cell) => {
    gameboardState[cell] = element;
  };
  const renderGameboard = () => {
    for (let i = 0; i < 9; i += 1) {
      gameboardCells[i].textContent = gameboardState[i];
    }
  };
  return { addElement, renderGameboard };
})();

gameboard.renderGameboard();
