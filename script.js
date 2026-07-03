const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restart");
const resetBtn = document.getElementById("reset");

const pvpBtn = document.getElementById("pvp");
const aiBtn = document.getElementById("ai");

const xScore = document.getElementById("xScore");
const oScore = document.getElementById("oScore");
const drawScore = document.getElementById("drawScore");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;
let vsAI = false;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

pvpBtn.onclick = () =>{
    vsAI = false;
    restartGame();
}

aiBtn.onclick = () =>{
    vsAI = true;
    restartGame();
}

cells.forEach(cell=>{
    cell.addEventListener("click",cellClicked);
});

restartBtn.addEventListener("click",restartGame);

resetBtn.addEventListener("click",()=>{
    scoreX=0;
    scoreO=0;
    scoreDraw=0;
    updateScores();
    restartGame();
});

function cellClicked(){

    const index=this.dataset.index;

    if(board[index]!=="" || !gameActive)
        return;

    makeMove(index,currentPlayer);

    if(checkWinner())
        return;

    if(board.every(cell=>cell!="")){
        statusText.textContent="It's a Draw!";
        scoreDraw++;
        updateScores();
        gameActive=false;
        return;
    }

    currentPlayer=currentPlayer==="X"?"O":"X";
    statusText.textContent=`Player ${currentPlayer}'s Turn`;

    if(vsAI && currentPlayer==="O" && gameActive){
        setTimeout(aiMove,500);
    }
}

function makeMove(index,player){
    board[index]=player;
    cells[index].textContent=player;
}

function aiMove(){

    let empty=[];

    board.forEach((value,index)=>{
        if(value==="")
            empty.push(index);
    });

    if(empty.length===0) return;

    let randomIndex=empty[Math.floor(Math.random()*empty.length)];

    makeMove(randomIndex,"O");

    if(checkWinner())
        return;

    if(board.every(cell=>cell!="")){
        statusText.textContent="It's a Draw!";
        scoreDraw++;
        updateScores();
        gameActive=false;
        return;
    }

    currentPlayer="X";
    statusText.textContent="Player X's Turn";
}

function checkWinner(){

    for(let pattern of winPatterns){

        let [a,b,c]=pattern;

        if(
            board[a] &&
            board[a]===board[b] &&
            board[a]===board[c]
        ){

            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");

            statusText.textContent=`Player ${board[a]} Wins!`;

            if(board[a]=="X")
                scoreX++;
            else
                scoreO++;

            updateScores();

            gameActive=false;
            return true;
        }
    }

    return false;
}

function updateScores(){
    xScore.textContent=scoreX;
    oScore.textContent=scoreO;
    drawScore.textContent=scoreDraw;
}

function restartGame(){

    board=["","","","","","","","",""];

    currentPlayer="X";

    gameActive=true;

    statusText.textContent="Player X's Turn";

    cells.forEach(cell=>{
        cell.textContent="";
        cell.classList.remove("win");
    });

}