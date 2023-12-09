function Gameboard() {
    const rows = 3;
    const columns = 3;
    board = [];
    
    for (let i=0; i<rows;i++) {
      board[i] = [];
      for (let j=0; j<columns; j++){
        board[i].push(0);
      };
    };
    
    const getBoard = () => board;
    const printBoard = () => console.log(board);
    
    const playMarker = (row, column, player) => {
      tryAgain = false;
      if (board[row][column] == 0){
        board[row][column] = player;
      } else {
        tryAgain = true;
      };
    };

    return { playMarker, getBoard, printBoard }
  };

  
  
  function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ){
    const gameBoard = Gameboard();
    const board = gameBoard.getBoard();
    
    const players = [
      {
        name: playerOneName,
        marker: 1
      },
      {
        name: playerTwoName,
        marker: 2
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
        console.log(`${getActivePlayer().name} wins!`)
      } else {
        switchPlayerTurn();
        printNewRound();
      };
    };
    printNewRound();
    
    return { playRound, getActivePlayer }
  };
  
  const game = GameController();