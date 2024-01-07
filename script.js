function Gameboard() {
    const rows = 3;
    const columns = 3;
    board = [];
    
    //create 2d array
    for (let i=0; i<rows;i++) {
      board[i] = [];
      for (let j=0; j<columns; j++){
        board[i].push(" ");
      };
    };
    
    //export board
    const getBoard = () => board;
    //display board for console gaming
    const printBoard = () => console.log(board);
    
    const playMarker = (row, column, player) => {
    //catch case for console game, may not need for UI version
      tryAgain = false;
      if (board[row][column] == " "){
        board[row][column] = player;
      } else {
        tryAgain = true;
      };
    };

    function resetBoard() {
      for (let i=0; i<rows; i++){
        for (let j=0; j<columns; j++){
          board[i].splice([j], 1, " ");
        };
      };
    };

    return { playMarker, getBoard, printBoard, resetBoard }
  };

  
  
  function GameController(
    playerOneName = document.getElementById("playerOneName").value,
    playerTwoName = document.getElementById("playerTwoName").value
  ){
    const gameBoard = Gameboard();
    const board = gameBoard.getBoard();
    
    const players = [
      {
        name: playerOneName,
        marker: "X"
      },
      {
        name: playerTwoName,
        marker: "O"
      }
    ];
    
    let activePlayer = players[0];
    
    const switchPlayerTurn = () =>  {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
    
    const printNewRound = () => {
      gameBoard.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`)
    };
    
    //Compare board tiles to check for a winner
    function isGameOver() {
        // check upper row
        if (board[0][1] == board[0][0] && board[0][1] == board[0][2] && board[0][1] != 0) {
          return board[0][1]
        }
        // check lower row
        if (board[2][1] == board[2][0] && board[2][1] == board[2][2] && board[2][1] != 0) {
          return board[2][1]
        }
        // check left column
        if (board[1][0] == board[0][0] && board[1][0] == board[2][0] && board[1][0] != 0) {
          return board[1][0]
        }
        // check right column
        if (board[1][2] == board[0][2] && board[1][2] == board[2][2] && board[1][2] != 0) {
          return board[1][2]
        }
        // check center row, column, and diagonals
        if (
          board[1][1] != 0 &&
          ((board[1][1] == board[1][0] && board[1][1] == board[1][2]) ||
            (board[1][1] == board[0][1] && board[1][1] == board[2][1]) ||
            (board[1][1] == board[0][0] && board[1][1] == board[2][2]) ||
            (board[1][1] == board[2][0] && board[1][1] == board[0][2]))
        ) {
          return board[1][1]
        }
      
        return 0
      };

    //Track turns to create a case for Draw
    let turnCounter = 0;
    function incrementTurn (){
      turnCounter++;
    };
    const getTurnNumber = () => turnCounter;
    const resetTurnNumber = () => turnCounter = 0;
      
    const playRound = (row, column) => {
      gameBoard.playMarker(row, column, getActivePlayer().marker);
      const checkGame = isGameOver();
      if (tryAgain == true){
        console.log("Try again");
      } else if (checkGame != 0) {
        console.log("Game over");
      } else {
        incrementTurn();
        switchPlayerTurn();
        printNewRound();
      };
    };
    
    //Reset the board and switch players for a new game
    function resetGame () {
      gameBoard.resetBoard();
      switchPlayerTurn();
    };

    printNewRound();
    
    return { playRound, getActivePlayer, getBoard: gameBoard.getBoard, isGameOver, resetGame, getTurnNumber, resetTurnNumber}
  };
  
  function ScreenController(){
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
      boardDiv.textContent = "";
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
      playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

      board.forEach(row => {
        row.forEach((cell, index) => {
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          cellButton.dataset.row = '';
          cellButton.dataset.box = index;
          cellButton.textContent = cell;
          boardDiv.appendChild(cellButton);
        });
      });

      const cellGroup = document.getElementsByClassName("cell");
      for (let i=0; i < cellGroup.length; i++){
        if (i < 3) {
          cellGroup[i].dataset.row = 0;
        } else if (i >= 3 && i < 6) {
          cellGroup[i].dataset.row = 1;
        } else {
          cellGroup[i].dataset.row = 2;
        }
      };

      let checkGame = game.isGameOver();
      if (checkGame != 0)
      {
        displayWinner();
        enableResetGame();
        game.resetGame();
        game.resetTurnNumber();
      }
      else if (checkGame == 0 && game.getTurnNumber() == 9) {
        playerTurnDiv.textContent = "Draw!";
        enableResetGame();
        game.resetGame();
        game.resetTurnNumber();
      }
    };

    function displayWinner(){
      const activePlayer = game.getActivePlayer();
      playerTurnDiv.textContent = `${activePlayer.name} wins!`;
      boardDiv.removeEventListener("click", clickHandlerBoard);
    };

    function clickHandlerBoard(e) {
      const selectedBoxAsRow = e.target.dataset.row;
      const selectedBoxAsColumn = e.target.dataset.box;
      if (!selectedBoxAsRow) return;
      game.playRound(selectedBoxAsRow, selectedBoxAsColumn);
      console.log(game.turnCounter)
      updateScreen();
    };

    function newGame(){
      updateScreen();
      boardDiv.addEventListener("click", clickHandlerBoard);
      resetGameButton.hidden = true;
    }

    //Reset Game
    const resetGameButton = document.createElement('button');
    resetGameButton.textContent = "Play Again";
    resetGameButton.setAttribute("id", "reset-game-button");
    document.body.appendChild(resetGameButton);
    resetGameButton.hidden = true;
    function enableResetGame() {
      resetGameButton.addEventListener("click", newGame);
      resetGameButton.hidden = false;
    };

    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();
  };

  function introScreen(){
    const playerForm = document.querySelector('.player-form');
    const formSubmit = document.querySelector('.player-form-submit');
    function playerSubmitHandler(e) {
      playerForm.hidden = true;
      ScreenController();
      e.preventDefault();
    };

    formSubmit.addEventListener("click", playerSubmitHandler);
  };

  introScreen();

  // ScreenController();