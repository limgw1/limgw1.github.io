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

//Variable for control
let controlsMap = {}
let currentlyMoving = null
let lastActivatedDirection = ""
let dirKeyPressed = 0

//Variables to make sure these controls dont repeat with OS's ARR when held down
let hardDropRepeatBlocker = false
let repeatBlockerCounterclockwise = false
let repeatBlockerClockwise = false
let repeatBlocker180 = false

//Variables for the board
let grid = []
let stage = 0 //Stage 0 for unrendered game, Stage 1 for active game, Stage 2 for finished game, Stage 3 for paused game, Stage 4 for controls

//Variables for the display
let linesLeft = 40
let rawTimer = 0
let pieceCount = 0

//Variables for the game
let gameBag = []
var currentPiece = null

//Variables for holding
let savedPiece = null //Stores the HoldPiece model
let internalSavedPiece = null //Stores the Piece model of the holded piece
let holded = false //Starts off as true because rendering the first piece toggles it to false
let firstHold = 0

//Variables for model
let hold = new HoldModel(holdContext)
let queue = new QueueModel(queueContext)

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
    currentPiece.settingsDAS = tuning.delayedAutoShift
    currentPiece.settingsARR = tuning.automaticRepeatRate
    currentPiece.settingsSDRR = tuning.softDropRepeatRate
    currentPiece.index = rand
    if(currentPiece.index == 4){
      currentPiece.x = 4
    }
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
  if (!linesLeft <= 0){
    checkSpawn(currentPiece.x, currentPiece.y)
  }
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
    document.getElementById("remaining-lines").textContent = "Lines left: "+ linesLeft
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
    renderGameState()
  }
}
//End of code


//Start of code for holding a piece
function holdPiece(){
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
      if(currentPiece.index == 4){
        currentPiece.x = 4
      }else{
        currentPiece.x = 3
      }
    }
    hold.currentHoldPiece = displayedHoldPiece
    holded = true
  }
  hold.renderHoldState()
  newGameState()
}

//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
let sleep = (ms) => {
  return new Promise(resolve=>setTimeout(resolve,ms))
}
async function startGame(){
  endGame()
  document.getElementById("action-text").textContent = "Ready?"
  await sleep(500);
  document.getElementById("action-text").textContent = "GO!"
  await sleep(500);
  stage = 1
  newGameState()
  renderGameState()
}

//Start of code for displaying the timer
let timeInterval = setInterval(() => {
  if(stage == 1){
    updateTimer()
  }else if(stage == 2){
    alert("Game over, final time is: " + rawTimer/100)
    endGame()
  }
}, 10);

// setInterval(()=>{console.log(dirKeyPressed),50})
function updateTimer(){
  rawTimer ++
  document.getElementById("time").textContent = "Time: "+(rawTimer/100).toFixed(2)
}
//End of code


//Code for controls
onkeydown = function(e){
  if (stage == 0 || stage == 1){
    e.preventDefault()
    controlsMap[e.key] = e.type == 'keydown'
    if(controlsMap[controls.moveLeft] && timeStartOfLeftDAS == false){
      timeStartOfLeftDAS = Date.now()
      timeStartOfDAS = Date.now()
      lastActivatedDirection = "L"
      mainMoveFunction(lastActivatedDirection)
      dirKeyPressed ++
    }
    if(controlsMap[controls.moveRight] && timeStartOfRightDAS == false){
      timeStartOfRightDAS = Date.now()
      timeStartOfDAS = Date.now()
      lastActivatedDirection = "R"
      mainMoveFunction(lastActivatedDirection)
      dirKeyPressed ++
    }
    if(controlsMap[controls.hold] == true){
      holdPiece()
    }
    if(controlsMap[controls.rotateClockwise] == true){
      if(!repeatBlockerClockwise){
        repeatBlockerClockwise = true
        rotateClockwise(currentPiece)
        lockDelayTest()
      }
    }
    if(controlsMap[controls.rotateCounterclockwise] == true){
      if(!repeatBlockerCounterclockwise){
        repeatBlockerCounterclockwise = true
        rotateCounterClockwise(currentPiece)
        lockDelayTest()
      }
    }
    if(controlsMap[controls.rotate180] == true){
      if(!repeatBlocker180){
        repeatBlocker180 = true
        rotate180(currentPiece)
      }
    }
    if(controlsMap[controls.softDrop] == true && !isSoftDropping){
      isSoftDropping = true
      mainSoftDropFunction(e, currentPiece)
    }
    if(controlsMap[controls.hardDrop] == true){
      if (!hardDropRepeatBlocker){
        hardDropRepeatBlocker = true
        hardDrop(currentPiece)
      }
    }
    if(controlsMap[controls.restart] == true){
      startGame()
    }
  }}


document.addEventListener("keyup", (e)=> {
  controlsMap[e.key] = e.type == 'keydown'
  e.preventDefault()
  switch(e.key){
    case controls.hold:
      keyupFunc(e)
      break
    case controls.moveLeft:
      timeStartOfLeftDAS = false
      if(timeStartOfRightDAS){
        lastActivatedDirection = "R"
      }
      dirKeyPressed --
      if(dirKeyPressed == 0){
        for(i=0;i<9999;i++){
          if (i == moveInterval){
            clearInterval(i)
          }
        }
        isPressedDown = false
        dasCharged = false
      }
      break
    case controls.moveRight:
      timeStartOfRightDAS = false
      if(timeStartOfLeftDAS){
        lastActivatedDirection = "L"
      }
      dirKeyPressed--
      if(dirKeyPressed == 0){
        for(i=0;i<9999;i++){
          if (i == moveInterval){
            clearInterval(i)
          }
        }
        isPressedDown = false
        dasCharged = false
      }
      break
    case controls.softDrop:
      isSoftDropping = false
      keyupFunc(e)
      break
    case controls.hardDrop:
      hardDropRepeatBlocker = false
      keyupFunc(e)
      break
    case controls.rotateClockwise:
      repeatBlockerClockwise = false
      break
    case controls.rotateCounterclockwise:
      repeatBlockerCounterclockwise = false
      break
    case controls.rotate180:
      repeatBlocker180 = false
      break
  }
})

function endGame(){
  stage = 0;
  boardContext.clearRect(0,0, ROWS*PIECE_WIDTH, COLS*PIECE_WIDTH)
  queueContext.clearRect(0,0, QUEUEROWS*PIECE_WIDTH, QUEUECOLS*PIECE_WIDTH)
  holdContext.clearRect(0,0, HOLDROWS*PIECE_WIDTH, HOLDCOLS*PIECE_WIDTH)
  savedPiece = null
  internalSavedPiece = null
  hold = new HoldModel(holdContext)
  holded = false
  firstHold = 0
  gameBag = []
  currentPiece = null
  linesLeft = 40
  rawTimer = 0
  pieceCount = 0
  grid = makeStartingGrid()
}

grid = makeStartingGrid()
loadControls()
loadTuning()


