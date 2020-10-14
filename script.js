const Minesweeper = () => {
    let gameStatus = 'in progress';
    let sizeSetting = '';
    let difficulty = '';
    let size = 0;
    let mines = [];
    let adjacentMines = [];
    let revealed = [];
    let cellsLeft = 0;
    let numberOfMines = 0;

    function createGame(){
        initializeArrays();
        addMines();
        setAdjacency();
    }

    function addMines(){
        numberOfMines = getNumberOfMines();
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
        size = getSize();
        cellsLeft = size * size;
        mines = new Array(size).fill(false).map(() => new Array(size).fill(false));
        revealed = new Array(size).fill(false).map(() => new Array(size).fill(false));
        adjacentMines = new Array(size).fill(0).map(() => new Array(size).fill(0));
    }

    function getMinePosition(){
        let x = getRandomIndex();
        let y = getRandomIndex();
        return {x, y};
    }

    function getRandomIndex(){
        return Math.floor(Math.random * (size + 1));
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
        if(!outOfBounds(x, y)){
            if(revealed[x][y]){
                return;
            }

            revealed[x][y] = true;
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

    function gameOver(result){
        gameStatus = result;
        revealed = new Array(size).fill(true).map(() => new Array(size).fill(true));
    }

    function outOfBounds(x, y){
        return (x < 0 || x >= size || y < 0 || y >= size);
    }
}


const displayController = () => {
    
}