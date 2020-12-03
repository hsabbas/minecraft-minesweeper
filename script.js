const Minesweeper = () => {
    let gameStatus = 'in progress';
    // let sizeSetting = '';
    let difficulty = '';
    let size = 0;
    let mines = [];
    let adjacentMines = [];
    let revealed = [];
    let cellsLeft = 0;
    let numberOfMines = 0;

    function startGame(difficultyPicked = 'normal'){
        setDifficulty(difficultyPicked.toLowerCase());
        initializeArrays();
        addMines();
        setAdjacency();
        return size;
    }

    function setDifficulty(theDifficulty){
        difficulty = theDifficulty;
        switch(difficulty){
            case 'easy':
                size = 9;
                numberOfMines = 10;
                break;
            case 'normal':
                size = 16;
                numberOfMines = 40;
                break;
            case 'hard':
                size = 24;
                numberOfMines = 99;
                break;
        }
    }

    function addMines(){
        let minesSet = 0;
        let position = {};

        while(minesSet < numberOfMines){
            position = getMinePosition();
            if(!mines[position.x][position.y]){
                mines[position.x][position.y] = true;
                minesSet++;
            }
        }
    }

    function initializeArrays(){
        cellsLeft = size * size;
        mines = new Array(size).fill(false).map(() => new Array(size).fill(false));
        revealed = new Array(size).fill("sealed").map(() => new Array(size).fill("sealed"));
        adjacentMines = new Array(size).fill(0).map(() => new Array(size).fill(0));
    }

    function getMinePosition(){
        let x = getRandomIndex();
        let y = getRandomIndex();
        return {x, y};
    }

    function getRandomIndex(){
        return Math.floor(Math.random() * size);
    }

    function setAdjacency(){
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                adjacentMines[i][j] = findAdjacentCells(i, j);
            }
        }
    }

    function findAdjacentCells(x, y){
        if(mines[x][y]){
            return 0;
        }

        let count = 0;
        if(!outOfBounds(x - 1, y - 1) && mines[x - 1][y - 1]){
            count++;
        }

        if(!outOfBounds(x, y - 1) && mines[x][y - 1]){
            count++;
        }

        if(!outOfBounds(x + 1, y - 1) && mines[x + 1][y - 1]){
            count++;
        }

        if(!outOfBounds(x - 1, y) && mines[x - 1][y]){
            count++;
        }

        if(!outOfBounds(x + 1, y) && mines[x + 1][y]){
            count++;
        }

        if(!outOfBounds(x - 1, y + 1) && mines[x - 1][y + 1]){
            count++;
        }

        if(!outOfBounds(x, y + 1) && mines[x][y + 1]){
            count++;
        }

        if(!outOfBounds(x + 1, y + 1) && mines[x + 1][y + 1]){
            count++;
        }

        return count;
    }

    function revealCell(x, y){
        if(!outOfBounds(x, y) && revealed[x][y] ==='sealed'){
            revealed[x][y] = "revealed";
            cellsLeft--;

            if(mines[x][y]){
                gameOver('lost');
                return;
            } else if(cellsLeft == numberOfMines) {
                gameOver('won');
                return;
            }

            if(adjacentMines[x][y] == 0){
                revealCell[x - 1][y - 1];
                revealCell[x][y - 1];
                revealCell[x + 1][y - 1];
                revealCell[x - 1][y];
                revealCell[x + 1][y];
                revealCell[x - 1][y + 1];
                revealCell[x][y + 1];
                revealCell[x + 1][y + 1];
            }
        }
    }

    function flagCell(x, y){
        if(revealed[x][y] == 'sealed'){
            revealed[x][y] = "flagged";
        } else if(revealed[x][y] == 'flagged') {
            revealed[x][y] ='sealed';
        }
    }

    function gameOver(result){
        gameStatus = result;
        revealed = new Array(size).fill('revealed').map(() => new Array(size).fill('revealed'));
    }

    function outOfBounds(x, y){
        return (x < 0 || x >= size || y < 0 || y >= size);
    }

    return{
        startGame,
        revealCell,
        flagCell
    }
}


const DisplayController = () => {
    const startScreen = document.getElementById('start-screen');
    const gameBoard = document.getElementById('game-board');
    const gameGrid = document.getElementById('grid-container');
    const startBtn = document.getElementById('start-btn');
    const difficultyChoices = document.querySelectorAll('input[name="difficulty"]');
    let minesweeper = Minesweeper();
    let size = 0;

    function start(){
        let difficulty = normal;
        for(choice of difficultyChoices){
            if(choice.checked){
                difficulty = choice.value;
            }
        }
        size = minesweeper.startGame(difficulty);
        startScreen.style.display = 'none';
        gameBoard.style.display = 'block';
        createBoard(size);
    }

    function createBoard(size){
        gameGrid.style.display = "grid";
        gameGrid.style.gridTemplateColumns = `repeat(${size}, 20px)`;
        gameGrid.style.gridTemplateRows = `repeat(${size}, 20px)`;
        gameGrid.style.width = `${size * 20 + size - 1}px`;
        gameGrid.style.height = `${size * 20 + size - 1}px`;

        for(let i = 0; i < size ** 2; i++){
            let cell = document.createElement("div");
            cell.className = "cell unrevealed";
            gameGrid.appendChild(cell);
        }
    }

    function initialize(){
        startBtn.addEventListener("click", start);
    }

    return{initialize};
}

let displayController = DisplayController();
displayController.initialize();