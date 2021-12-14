// Main Script to run the actual game,
// Setup

let boardCanvas = document.getElementById("board")
let queueCanvas = document.getElementById("queue")
let holdCanvas = document.getElementById("hold")

let boardContext = boardCanvas.getContext("2d")
let queueContext = queueCanvas.getContext("2d")
let holdContext = holdCanvas.getContext("2d")

boardContext.scale(PIECE_WIDTH, PIECE_WIDTH)
queueContext.scale(PIECE_WIDTH, PIECE_WIDTH)
holdContext.scale(PIECE_WIDTH, PIECE_WIDTH)

//Variables for the board
let grid = []
let stage = 0 //Stage 0 for unrendered game, Stage 1 for active game, Stage 2 for finished game, Stage 3 for paused game

//Variables for the display
let linesLeft = 20
let rawTimer = 0
let pieceCount = 0

//Variables for the game
let gameBag = []
let currentPiece = null

//Variables for holding
let savedPiece = null //Stores the HoldPiece model
let internalSavedPiece = null //Stores the Piece model of the holded piece
let holded = false //Starts off as true because rendering the first piece toggles it to false
let firstHold = 0


let hold = new HoldModel(holdContext)
let queue = new QueueModel(queueContext)

// setInterval(() => {
//   renderGameState()
// }, 10);

//Code for creating the main board grid
let makeStartingGrid = () => {
  let grid = []
  for (let i = 0; i < ROWS; i++){
    grid.push([]) //Pushes an empty array into grid for every row (20)
    for (let j = 0; j < COLS; j++){
      grid[grid.length - 1].push(0) //Creates a 20x10 array with all 0s
    }
  }
  return grid
}

//Start of code for rendering a new game state
let newGameState = () => {
  clearLine()
  if (currentPiece === null){
    gameBag.shift()
    restockBag()
    const rand = gameBag[0]
    currentPiece = new Piece(SHAPES[rand], boardContext)
    currentPiece.index = rand
    renderGameState()
    //Renders queue board
    let queueArray = []
    for (i=0; i<6; i++){
      const queuePiece = new QueuePiece(SHAPES[gameBag[i]], queueContext)
      queueArray[i] = queuePiece
    }
    queue.queueArray = queueArray
    queue.renderQueueState()
  }else{
    renderGameState()
  }
  hold.renderHoldState()
}
//End of code

//Renders code for Active Game State and falling piece
let renderGameState = () => {
  //Renders the board
  for (let i = 0; i < grid.length; i++){
    for (let j = 0; j < grid[i].length; j++){
      let cell = grid[i][j]
      boardContext.fillStyle = COLORS[cell]
      boardContext.fillRect(j, i, 1, 1)
    }
  }
  //Renders falling piece
  if (currentPiece !== null){
    currentPiece.renderPiece()
  }
}


//Start of code for 7 bag
function shuffle() {
  let array = [1,2,3,4,5,6,7]
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
function restockBag(){
  if (gameBag.length < 7){
    gameBag = gameBag.concat(shuffle())
  }
}
//End of code


//Start of code for clearing a line
const clearLine = () => {
  const allFilled = (row) => {
    for (let x of row){
      if (x === 0){
        return false
      }
    }
    linesLeft --
    document.getElementById("remaining-lines").innerHTML = "Lines left: "+ linesLeft
    return true
  }
  for (let i = 0; i < grid.length; i++){
    if (allFilled(grid[i])){
      grid.splice(i, 1)
      grid.unshift([0,0,0,0,0,0,0,0,0,0])
    }
  }
  if (linesLeft <= 0){
    stage = 2
  }
}
//End of code


//Start of code for holding a piece
let holdPiece = () => {
  displayedHoldPiece = new HoldPiece(SHAPES[currentPiece.index], holdContext)
  // internalSavedPiece = new Piece(SHAPES[currentPieceIndex], boardContext)
  if (holded == false){
    if (internalSavedPiece == null){
      internalSavedPiece = currentPiece
      currentPiece = null
    }else{
      let temp = currentPiece
      currentPiece = internalSavedPiece
      internalSavedPiece = temp
      currentPiece.y = 0
      currentPiece.x = Math.floor(COLS/2)
      // [currentPiece, internalSavedPiece] = [internalSavedPiece, currentPiece]
    }
    hold.currentHoldPiece = displayedHoldPiece
    holded = true
  }
  hold.renderHoldState()
  newGameState()
}

//TODO: Keep this in 60fps
//ASYNC AWAIT IS THE ONLY WAY TO ADD DELAY TO THE JS CODE
//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
let sleep = (ms) => {
  return new Promise(resolve=>setTimeout(resolve,ms))
}
async function startGame(){
  document.getElementById("action-text").style = "display:block"
  await sleep(1000);
  document.getElementById("action-text").innerHTML = "GO!"
  await sleep(1000);
  stage = 1
  newGameState()
  renderGameState()
}

//Start of code for displaying the timer
setInterval(() => {
  if(stage == 1){
    updateTimer()
  }else if(stage == 2){
    alert("Game over, final time is: " + rawTimer/100)
    stage = 0
  }
}, 10);
function updateTimer(){
  rawTimer ++
  document.getElementById("time").innerHTML = "Time: "+(rawTimer/100)
}
//End of code


document.addEventListener("keydown", (e)=> {
  e.preventDefault()
  switch(e.key){
    case controls.rotateClockwise:
      currentPiece.rotateClockwise()
      break
    case controls.moveRight:
      currentPiece.move(true)
      break
    case controls.softDrop:
      currentPiece.moveDown()
      break
    case controls.moveLeft:
      currentPiece.move(false)
      break
    case controls.hardDrop:
      currentPiece.hardDrop()
      break
    case controls.rotateCounterclockwise:
      currentPiece.rotateCounterClockwise()
      break
    case controls.rotate180:
      currentPiece.rotate180()
      break
    case controls.hold:
      holdPiece()
      break
    case controls.restart:
      startGame()
      break
  }
})

grid = makeStartingGrid()


