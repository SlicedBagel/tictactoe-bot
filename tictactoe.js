const resetButton = document.querySelector("button.reset");
const winContainer = document.querySelector("div.winContainer");
const winText = document.querySelector("div.winBox p");

let divs = [];

let turn = "x";
let botTurn = "o";
let gameOver = false;

let grid = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
];

if (turn == botTurn) {
    let botMove = makeBotMove(grid.slice(0));
    turnHandler(botMove);
}

resetButton.addEventListener("click", () => {
    grid = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];
    updateScreen();
    turn = "x"
    gameOver = false;
    winContainer.classList.add("hidden");

    if (turn == botTurn) {
        let botMove = makeBotMove(grid.slice(0));
        turnHandler(botMove);
    }    
})

function updateScreen() {
    for (let i = 0; i < grid.length; i++) {
        let div = document.querySelector(`.div${i+1}`);
        div.innerHTML = grid[i] === 0 ? "" : grid[i];
    }
}

function checkWin(board) {
    for (let row = 0; row < 3; row++) {
        if (board[row*3] === board[row*3+1] && board[row*3] === board[row*3+2] && board[row*3] !== 0) {
            return board[row*3]
        }
    }
    for (let column = 0; column < 3; column++) {
        if (board[column] === board[column+3] && board[column] === board[column+6] && board[column] !== 0) {
            return board[column]
        }
    }
    if (board[0] === board[4] && board[0] === board[8] && board[0] !== 0) {
        return board[0]
    }
    if (board[2] === board[4] && board[2] === board[6] && board[2] !== 0) {
        return board[2]
    }
    return 0
}

function turnHandler(i, isBot = false) {
    if (grid[i] === 0 && (isBot == (turn == botTurn))) {
        if (!gameOver) {
            grid[i] = turn
            turn = turn === "x" ? "o" : "x";
            updateScreen();
        }
        let winner = checkWin(grid);
        if (winner !== 0) {
            gameOver = true;
            winContainer.classList.remove("hidden")
            winText.innerHTML = `Winner: ${winner.toUpperCase()}`;

        } else if (grid.filter(element => element === 0).length == 0) {
            gameOver = true;
            winContainer.classList.remove("hidden")
            winText.innerHTML = `Draw`;

        } else {
            if (turn === botTurn) {
                setTimeout(() => {
                    let botMove = makeBotMove(grid.slice(0));
                    turnHandler(botMove, true);
                }, 500);
            }
        }
    }
}

function makeBotMove(board) {
    if (botTurn === 'x') {
        let bestValue = -2
        let bestMove;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0) {
                board[i] = 'x'
                let score = botMinimax(board.slice(0), false)
                if (score > bestValue) {
                    bestValue = score;
                    bestMove = i;
                }
                board[i] = 0;
            }
        }
        return bestMove;
    } else {
        let bestValue = 2;
        let bestMove;

        for (let i = 0; i < board.length; i++) {
            if (board[i] == 0) {
                board[i] = 'o';
                let score = botMinimax(board.slice(0), true);
                if (score < bestValue) {
                    bestValue = score;
                    bestMove = i;
                }
                board[i] = 0;
            }
        }
        return bestMove;
    }
}

// minimax function to make bot move
// maximizing x
function botMinimax(board, maximizingPlayer) {
    let winner = checkWin(board)
    if (winner === 'x') return 1
    if (winner === 'o') return -1
    if (board.filter((element) => element === 0).length === 0) return 0
    if (maximizingPlayer) {
        let bestMove = -2
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0) {
                board[i] = 'x'
                let score = botMinimax(board.slice(0), !maximizingPlayer)
                if (score > bestMove) bestMove = score;
                board[i] = 0;
            }
        }
        return bestMove;
    }
    else {
        let bestMove = 2;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0) {
                board[i] = 'o'
                let score = botMinimax(board.slice(0), !maximizingPlayer);
                if (score < bestMove) bestMove = score;
                board[i] = 0;
            }
        }
        return bestMove;
    }
}

for (let i = 0; i < 9; i++) {
    let element = document.querySelector(`.div${i+1}`);
    divs.push(element);
    element.addEventListener("click", () => {turnHandler(i)});
}

