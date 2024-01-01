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

    return { playMarker, getBoard, printBoard }
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
      
    const playRound = (row, column) => {
      gameBoard.playMarker(row, column, getActivePlayer().marker);
      const checkGame = isGameOver();
      if (tryAgain == true){
        console.log("Try again");
      } else if (checkGame != 0) {
        console.log("Game over");
      } else {
        switchPlayerTurn();
        printNewRound();
      };
    };
    printNewRound();
    
    return { playRound, getActivePlayer, getBoard: gameBoard.getBoard, isGameOver }
  };
  
  function ScreenController(){
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const playerForm = document.querySelector('.player-form')

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
      updateScreen();
    };

    function playerSubmitHandler(e) {
      playerForm.hidden = true;
      e.preventDefault();
    };

    boardDiv.addEventListener("click", clickHandlerBoard);
    playerForm.addEventListener("click", playerSubmitHandler);

    updateScreen();
  };

  ScreenController();