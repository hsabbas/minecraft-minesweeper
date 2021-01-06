const Minesweeper = () => {
    let gameStatus = 'in progress';
    let difficulty = '';
    let size = 0;
    let mines = [];
    let adjacentMines = [];
    let revealed = [];
    let cellsLeft = 0;
    let numberOfMines = 0;
    let flags = 0;

    function startGame(difficultyPicked = 'normal'){
        gameStatus = 'in progress';
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
                size = 22;
                numberOfMines = 90;
                break;
        }
        flags = numberOfMines;
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
                revealCell(x - 1, y - 1);
                revealCell(x, y - 1);
                revealCell(x + 1, y - 1);
                revealCell(x - 1, y);
                revealCell(x + 1, y);
                revealCell(x - 1, y + 1);
                revealCell(x, y + 1);
                revealCell(x + 1, y + 1);
            }
        }
    }

    function flagCell(x, y){
        if(revealed[x][y] == 'sealed' && flags > 0){
            revealed[x][y] = "flagged";
            flags--;
        } else if(isFlagged(x, y)) {
            revealed[x][y] ='sealed';
            flags++;
        }
    }

    function gameOver(result){
        gameStatus = result;
        if(result === "lost"){
            revealed = new Array(size).fill('revealed').map(() => new Array(size).fill('revealed')); 
        } else {
            for(let x = 0; x < size; x++){
                for(let y =0; y < size; y++){
                    if(mines[x][y]){
                        revealed[x][y] = "flagged";
                    } else {
                        revealed[x][y] = "revealed";
                    }
                }
            }
        }
    }

    function outOfBounds(x, y){
        return (x < 0 || x >= size || y < 0 || y >= size);
    }

    function getStatus(){
        return gameStatus;
    }

    function isRevealed(x, y){
        return revealed[x][y] === "revealed";
    }

    function isFlagged(x, y){
        return revealed[x][y] ==="flagged";
    }

    function getAdjacency(x, y){
        return adjacentMines[x][y];
    }

    function isMine(x, y){
        return mines[x][y];
    }

    function getFlagsLeft(){
        return flags;
    }

    return{
        startGame,
        revealCell,
        flagCell,
        isRevealed,
        isFlagged,
        getAdjacency,
        isMine,
        getStatus,
        getFlagsLeft
    }
}


const DisplayController = () => {
    const startScreen = document.getElementById('start-screen');
    const continueBtn = document.getElementById('continue');
    const diffScreen = document.getElementById('difficulty-screen');
    const gameBoard = document.getElementById('game-board');
    const gameGrid = document.getElementById('grid-container');
    const startBtn = document.getElementById('start-btn');
    const difficultyChoices = document.querySelectorAll('input[name="difficulty"]');
    const endScreen = document.getElementById("end-screen");
    const endText = document.getElementById("end-text");
    const newGameBtn = document.getElementById("new-game");
    const catsCounter = document.getElementById("cats-counter");
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
        diffScreen.style.display = 'none';
        gameBoard.style.display = 'block';
        createBoard(size);
        catsCounter.innerText = minesweeper.getFlagsLeft();
    }

    function createBoard(size){
        gameGrid.style.display = "grid";
        gameGrid.style.gridTemplateColumns = `repeat(${size}, 25px)`;
        gameGrid.style.gridTemplateRows = `repeat(${size}, 25px)`;
        gameGrid.style.width = `${size * 25 + size - 1}px`;
        gameGrid.style.height = `${size * 25 + size - 1}px`;

        for(let i = 0; i < size ** 2; i++){
            let cell = document.createElement("div");
            cell.className = "cell unrevealed";
            cell.addEventListener("mouseup", function(e){
                cellClicked(e, i);
            })
            gameGrid.appendChild(cell);
        }
    }

    function cellClicked(e, i){
        let rightClick;
	    if (e.which) rightClick = (e.which == 3);
        else if (e.button) rightClick = (e.button == 2);
        
        if (rightClick){
            minesweeper.flagCell(getX(i), getY(i));
            catsCounter.innerText = minesweeper.getFlagsLeft();
        } else {
            minesweeper.revealCell(getX(i), getY(i));
            if(minesweeper.getStatus() == 'lost'){
                endScreen.style.display = 'block';
                endText.innerText = "You Died!";
                endScreen.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
            } else if(minesweeper.getStatus() == 'won'){
                endScreen.style.display = 'block';
                endText.innerText = "You Win!";
            }
        }
        updateGrid();
    }

    getX = (i) => Math.floor(i / size);
    getY = (i) => i % size;
    getIndex = (x, y) => x * size + y;

    function updateGrid(){
        let cells = document.querySelectorAll(".cell");
        for(let x = 0; x < size; x++){
            for(let y = 0; y < size; y++){
                if(minesweeper.isRevealed(x, y)){
                    let imgUrl = "";
                    if(minesweeper.isMine(x, y)){
                        imgUrl = "url(images/creeper_face.png)";
                    } else {
                        imgUrl = getImgUrlForRevelaedCell(minesweeper.getAdjacency(x, y));
                    }
                    cells[getIndex(x, y)].style.backgroundImage = imgUrl;
                } else if(minesweeper.isFlagged(x, y)) {
                    cells[getIndex(x, y)].style.backgroundImage = "url(images/grass_top_with_cat.png)";
                } else {
                    cells[getIndex(x, y)].style.backgroundImage = "url(images/grass-top.jpeg)";
                }
            }
        }
    }

    function getImgUrlForRevelaedCell(numOfAdj){
        switch(numOfAdj){
            case 0:
                return "url(images/stone.png)";
                break;
            case 1:
                return "url(images/coal_ore.png)";
                break;
            case 2:
                return "url(images/iron_ore.png)";
                break;
            case 3:
                return "url(images/redstone_ore.png)";
                break;
            case 4:
                return "url(images/gold_ore.png)";
                break;
            case 5:
                return "url(images/lapis_ore.png)";
                break;
            case 6:
                return "url(images/emerald_ore.png)";
                break;
            case 7:
                return "url(images/diamond_ore.png)";
                break;
            case 8:
                return "url(images/ancient_debris_side.png)";
                break;
        }
    }

    function newGame(){
        endScreen.style.display = "none";
        endScreen.style.backgroundColor = "";
        gameBoard.style.display = "none";
        diffScreen.style.display = "block";
        gameGrid.innerHTML = "";
    }

    function continueClicked(){
        startScreen.style.display = "none";
        diffScreen.style.display = "block"
    }

    function initialize(){
        continueBtn.addEventListener("click", continueClicked);
        startBtn.addEventListener("click", start);
        newGameBtn.addEventListener("click", newGame);
    }

    return{initialize};
}

let displayController = DisplayController();
displayController.initialize();