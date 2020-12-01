const X_CLASS = 'x';
const O_CLASS = 'o';
const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winMessageEl = document.getElementById('winMessage');
const winMessageText = document.querySelector('[win-message-text]');
const restartBtn = document.getElementById('restartBtn');

let isOTurn;

startGame();

restartBtn.addEventListener('click', startGame);

function startGame() {
    isOTurn = false;
    winMessageEl.classList.remove('show');
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);

        cell.addEventListener('click', handleClick, {once: true});
    });
    setBoardHoverClass();
}


function handleClick(e) {
    const cell = e.target;
    const currentClass = isOTurn ? O_CLASS : X_CLASS;

    place(cell, currentClass);

    if(winCheck(currentClass)) {
        endGame(false);
    } else if(isDraw()) {
        endGame(true);
    } else {
        switchTurn();
        setBoardHoverClass();
    }
}

function place(cell, currentClass) {
    cell.classList.add(currentClass);
}

function switchTurn() {
    isOTurn = !isOTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);

    if(isOTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function winCheck(currentClass) {
    return WIN_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        })
    })
}

function endGame(draw) {
    if (draw) {
        winMessageText.innerText = `Draw!`;
    } else {
        winMessageText.innerText = `${isOTurn ? "O's" : "X's"} Wins!`;
    }

    winMessageEl.classList.add('show');
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || 
            cell.classList.contains(O_CLASS);
    })
}


