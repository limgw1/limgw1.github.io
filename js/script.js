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

let stage = 0 //Stage 0 for unrendered game, Stage 1 for active game, Stage 2 for finished game, Stage 3 for paused game
let linesLeft = 20
let gameBag = []
let savedPiece = null
let activePiece = null
let holded = false //Starts off as true because rendering the first piece toggles it to false
let firstHold = 0
let pieceCount = 0
let rawTimer = 0

let model = new GameModel(boardContext)
let hold = new HoldModel(holdContext)
let queue = new QueueModel(queueContext)

setInterval(() => {
  if (stage == 1){
    newGameState()
    updateTimer()
  }
}, GAME_CLOCK);

//For sprint timer
function updateTimer(){
  rawTimer ++
  document.getElementById("time").innerHTML = rawTimer/100
}


//Logic for 7 bag
function shuffle() {
  let array = [1,2,3,4,5,6,7]
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
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


let newGameState = () => {
  clearLine()
  // Renders the main board
  if (model.fallingPiece === null){
    gameBag.shift()
    restockBag()
    const rand = gameBag[0]
    activePiece = rand
    const newPiece = new Piece(SHAPES[rand], boardContext)
    model.fallingPiece = newPiece
    model.renderGameState()

    //Renders the queue board
    let queueArray = []
    for (i=0; i<6; i++){
      const queuePiece = new QueuePiece(SHAPES[gameBag[i]], queueContext)
      queueArray[i] = queuePiece
    }
    queue.queueArray = queueArray
    queue.renderQueueState()
  }else{
    model.renderGameState()
  }
  hold.renderHoldState()
}



const clearLine = () => {
  const allFilled = (row) => {
    for (let x of row){
      if (x === 0){
        return false
      }
    }
    linesLeft --
    document.getElementById("remaining-lines").innerHTML = linesLeft
    return true
  }
  for (let i = 0; i < model.grid.length; i++){
    if (allFilled(model.grid[i])){
      model.grid.splice(i, 1)
      model.grid.unshift([0,0,0,0,0,0,0,0,0,0])
    }
  }
  if (linesLeft == 0){
    alert("Game over, final time is: " + rawTimer/100)
    stage = 0
  }
}


function holdPiece(){
  const swapPiece = new Piece(SHAPES[activePiece], boardContext)
  const displayedHoldPiece = new HoldPiece(SHAPES[activePiece], holdContext)
  if (holded == false){
    firstHold++
    if (savedPiece == null){
      model.fallingPiece = null
      savedPiece = activePiece
    }else{
      [activePiece, savedPiece] = [savedPiece, activePiece]
      model.fallingPiece = new Piece(SHAPES[activePiece], boardContext)
    }
    hold.currentHoldPiece = displayedHoldPiece
    holded = true
  }
}


//ASYNC AWAIT IS THE ONLY WAY TO ADD DELAY TO THE JS CODE
//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms){
  return new Promise(resolve=>setTimeout(resolve,ms))
}

async function startGame(){
  document.getElementById("action-text").style = "display:block"
  await sleep(1000);
  document.getElementById("action-text").innerHTML = "GO!"
  await sleep(1000);
  stage = 1
}


document.addEventListener("keydown", (e)=> {
  e.preventDefault()
  switch(e.key){
    //Clockwise
    case "ArrowUp":
      model.rotateClockwise()
      break
    //Left
    case "ArrowRight":
      model.move(true)
      break
    //Right
    case "ArrowDown":
      model.moveDown()
      break
    //SD
    case "ArrowLeft":
      model.move(false)
      break
    case " ":
      model.hardDrop()
      break
    case "x":
      model.rotateCounterClockwise()
      break
    case "z":
      model.rotate180()
      break
    case "c":
      holdPiece()
      break
    case "r":
      startGame()
  }
})
