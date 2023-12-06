// The gameboard represents the state of the board where
// each square holds a Cell
function Gameboard() {
    const rows = 3;
    const columns = 3;
    board = [];
//Create a 2d array that will represent the state of the game using a nested loop
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    };
//getBoard will enable UI rendering    
    const getBoard = () => board;

    const playMarker = (row, column, player) => {
        if (board[row][column].getValue() == 0) {
            board[row][column].addMarker(player);
        } else {
            return;
        }
    };

    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
      console.log(boardWithCellValues);
    };

    return { getBoard, playMarker, printBoard };
}

//Cell represents one square on the board and will have a value of
//O: empty
//1: Player One's marker
//2: Player Two's marker
function Cell() {
    let value = 0;
    const addMarker = (player) => {
        value = player;
    };

    const getValue = () => value;

    return{addMarker, getValue};
};

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){
    const board = Gameboard();

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

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    const playRound = (row, column) => {
        board.playMarker(row, column, getActivePlayer().marker);

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer }
};

const game = GameController();