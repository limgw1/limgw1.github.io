//=================For testing purposes ==================//
//Required variables
settingsDAS = tuning['delayedAutoShift']
settingsARR = tuning['automaticRepeatRate']
settingsSDRR = tuning['softDropRepeatRate']
isPressedDown = false; //for move right/left
isSoftDropping = false; //for sd
dasCharged = false;
resetDAS = false;
timeStartOfLeftDAS = false;
timeStartOfRightDAS = false;
timeStartOfARR = 0;
timeStartOfSDRR = 0;
moveInterval = null;
softDropInterval = null;
lockDelayTimeout = null;
//Vars for lock delay
landed = false;
lockDelay = 0;
waitingForLockDelay = false;

//=====Handling spawn check=====
function checkSpawn(x, y, candidate=null){
  const shape =  candidate || currentPiece.shape
  const n = shape.length
  if (collision(currentPiece.x, currentPiece.y+1,)){
    lockDelayTest(x, y)
  }
  for (let i = 0; i < n; i++){ //Checks every block in the tetromino matrix
    for (let j = 0; j < n; j++){
      if (shape[i][j] > 0){
        if (grid[i][j] > 0){
          alert("Game over!")
          stage = 0
          endGame()
          break
        }
      }
    }
  }
}
//=====Handling hard drop=====
function hardDrop(){
  //CHANGE  CODE IF THERE IS ANOTHER TIMEOUT IN THE FUTURE
  for(i=0;i<999;i++){
    if (i !== moveInterval && i !== timeInterval && i !== softDropInterval){
      clearTimeout(i)
    }
  }
  const shape = currentPiece.shape
  let x = currentPiece.x
  let y = currentPiece.y
  while(!currentPiece.collision(x, y+1)){
    if (currentPiece.collision(x, y+1)){
    break
    }else{
      y += 1
    }
  }
  if (currentPiece.collision(x, y+1)){
    const shape = currentPiece.shape
    shape.map((row, i) => {
      row.map((cell, j) => {
        let p = x + j
        let q = y + i
        if (p >= 0 && p < COLS && q < ROWS && cell > 0){
          grid[q][p] = shape[i][j]
        }
      })
    })
  }
  currentPiece = null
  holded = false
  pieceCount ++
  document.getElementById("piece-count").textContent = "Piece: " +pieceCount
  newGameState()
}

//=====Handling Soft drop=====
function mainSoftDropFunction(e){
  softDropInterval = setInterval(() => {
    if (isSoftDropping){
      moveDown()
    }
  },4)
  if (controlsMap[controls.softDrop] == true){
    moveDown()
    timeStartOfSDRR = Date.now()
    softDropInterval()
  }
}

function moveDown(){
  if (tuning.softDropRepeatRate == 0){
    while(!collision(currentPiece.x, currentPiece.y+1)){
      if (collision(currentPiece.x, currentPiece.y+1)){
        landed = true
        break
      }else{
        currentPiece.y += 1
      }
    }
  }else{
    if (timeStartOfSDRR == 0){
      timeStartOfSDRR = Date.now()
    }
    if (Date.now() - timeStartOfSDRR >= settingsSDRR){
      if (collision(currentPiece.x, currentPiece.y+1)){
        landed = true
      }else{
        currentPiece.y += 1
      }
      timeStartOfSDRR = 0
    }
  }
  newGameState() //why is this needed?
}

//=====Handling collision=====
function collision(x, y, candidate=null){ //Takes in current top left corner of the nxn matrix of the piece
  const shape =  candidate || currentPiece.shape
  const n = shape.length
  for (let i = 0; i < n; i++){ //Checks every block in the tetromino matrix
    for (let j = 0; j < n; j++){
      if (shape[i][j] > 0){  //If not empty block in the tetromino matrix
        let p = x + j
        let q = y + i
        if (p >= 0 && p < COLS && q < ROWS){
          //If any of the pieces touches another non-blank square, return true
          if (grid[q][p] > 0){
            return true
          }
        }
        else{
          return true
        }
      }
    }
  }
  return false
}
//=====Handling moving left and right=====
function mainMoveFunction(){
  if (dirKeyPressed == 0){
    translate()
    isPressedDown = true
    moveInterval = setInterval(() => {move()},100)
  }else if(dirKeyPressed !== 0){
    console.log("mainmovefunction called when dirkeypress not 0")
    timeStartOfDAS = Date.now()
    multipleKeyPressTranslate()
  }else if(holded){
    //This case for after piece is holded we want the newly swapped piece to continue moving
    translate()
    timeStartOfDAS = Date.now()
    isPressedDown = true
    moveInterval = setInterval(() => {move()},100)
  }else{
    console.log("Main Move Function error")
  }
}

function move(){
  console.log(dasCharged)
  console.log(isPressedDown)
  if((Date.now()-timeStartOfDAS) >= settingsDAS){
    dasCharged = true
  }else{
    dasCharged = false
  }
  if(dasCharged && isPressedDown){
    if ((Date.now() - timeStartOfARR) >= settingsARR){
        translate()
        timeStartOfARR = Date.now()
      }
  }
}

function multipleKeyPressTranslate(){
  if (lastActivatedDirection == "R" && dirKeyPressed >= 1) {
    //move right
    console.log("MultipleKeypressTranslate move right")
    if (!collision(currentPiece.x+1, currentPiece.y)){
      currentPiece.x += 1
      landed = false
      waitingForLockDelay = false
    }
  }else if (lastActivatedDirection == "L" && dirKeyPressed >= 1){
    //move left
    console.log("MultipleKeypressTranslate move left")
    if (!collision(currentPiece.x-1, currentPiece.y)){
      currentPiece.x -= 1
      landed = false
      waitingForLockDelay = false
    }
  }
  renderGameState()
}

function translate(){
  // console.log(direction)
  // console.log(dasCharged)
  if (lastActivatedDirection == "R" && settingsARR == 0 && dasCharged) {
    //move all the way right
    while(!collision(currentPiece.x+1, currentPiece.y)){
      if (collision(currentPiece.x+1, currentPiece.y)){
      }else{
        currentPiece.x += 1
      }
    }
  }else if (lastActivatedDirection == "L" && settingsARR == 0 && dasCharged){
    //move all the way left
    while(!collision(currentPiece.x-1, currentPiece.y)){
      if (collision(currentPiece.x-1, currentPiece.y)){
      }else{
        currentPiece.x -= 1
      }
    }
  }else if (lastActivatedDirection == "R") {
    //move right
    if (!collision(currentPiece.x+1, currentPiece.y)){
      currentPiece.x += 1
      landed = false
      waitingForLockDelay = false
    }
  }else if (lastActivatedDirection == "L"){
    //move left
    if (!collision(currentPiece.x-1, currentPiece.y)){
      currentPiece.x -= 1
      landed = false
      waitingForLockDelay = false
    }else if(collision(currentPiece.x-1,currentPiece.y)){
    }
  }else{
    console.log("Errors")
  }
  renderGameState()
}

//=====Handling lock delay test=====
function lockDelayTest(x,y){
  const shape = currentPiece.shape
  const n = shape.length
  loop1:
  for (let i = 0; i < n; i++){ //Checks every block in the tetromino matrix
    loop2:
    for (let j = 0; j < n; j++){
      if (shape[i][j] > 0){  //If not empty block in the tetromino matrix
        let p = x + j
        let q = y + i + 1 //This is the up down direction
        if (p >= 0 && p < COLS && q < ROWS){
          if (grid[q][p] > 0){
            landed = true
            break loop1;
          }
        }else if(q >= ROWS){
          landed = true
          break loop1;
        }else{
          landed = false
          waitingForLockDelay = false
        }
      }
    }
  }
  if (landed && !waitingForLockDelay){
    waitingForLockDelay = true
    lockDelayCountdown()
  }
  return false
}

function lockDelayCountdown(){
  lockDelayTimeout = setTimeout(() => {
    if(landed && waitingForLockDelay){
      waitingForLockDelay = false
      lockPiece(currentPiece)
    }
  },LOCK_DELAY)
}

function lockPiece(){
  if (landed){
    const shape = currentPiece.shape
    const x = currentPiece.x
    const y = currentPiece.y
    shape.map((row, i) => {
      row.map((cell, j) => {
        let p = x + j
        let q = y + i
        if (p >= 0 && p < COLS && q < ROWS && cell > 0){
          grid[q][p] = shape[i][j]
        }
      })
    holded = false
    })
    for (let i = 0; i < grid.length; i++){
      for (let j = 0; j < grid[i].length; j++){
        let cell = grid[i][j]
        boardContext.fillStyle = COLORS[cell]
        boardContext.fillRect(j, i, 1, 1)
      }
    }
    //Might not need this, just game over when new piece spawns
    // if (currentPiece.y === 0){
    //   alert("Game over!")
    //   stage = 0
    //   endGame()
    // }
    currentPiece = null
    pieceCount ++
    document.getElementById("piece-count").textContent = "Piece: " +pieceCount
    newGameState()
  }
}

//=====Handle rotation======
function rotateClockwise(){
  let shape = [...currentPiece.shape.map((row) => [...row])]
  // Transpose Matrix (basically rotation)
  for (let y = 0; y< shape.length; y++){
    for (let x = 0; x < y; x++){
      [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]]
    }
  }
  // Reverse order of rows
  shape.forEach((row => row.reverse()))
  if (!collision(currentPiece.x, currentPiece.y, shape)) {
    currentPiece.shape = shape
  }
  if (!collision(currentPiece.x, currentPiece.y+1, shape)){
    landed = false
  }
  renderGameState()
}

function rotateCounterClockwise(){
  let shape = [...currentPiece.shape.map((row) => [...row])]
  // Reverse order of rows
  shape.forEach((row => row.reverse()))
  // Transpose Matrix (basically rotation)
  for (let y = 0; y< shape.length; y++){
    for (let x = 0; x < y; x++){
      [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]]
    }
  }
  if (!collision(currentPiece.x, currentPiece.y, shape)) {
    currentPiece.shape = shape
  }
  if (!collision(currentPiece.x, currentPiece.y+1, shape)){
    landed = false
  }
  renderGameState()
}

function rotate180(){
  let shape = [...currentPiece.shape.map((row) => [...row])]
  // Reverse order of rows
  shape.reverse()
  shape.forEach((row => row.reverse()))
  if (!collision(currentPiece.x, currentPiece.y)) {
    currentPiece.shape = shape
  }
  renderGameState()
}

//===== What to run when keyup =====
function keyupFunc(e){
  if((e.key == controls.moveLeft || e.key == controls.moveRight || e.key == controls.softDrop) && isPressedDown){
    for(i=0;i<9999;i++){
      if (i !== timeInterval && i !== lockDelayTimeout && i !== softDropInterval){
        clearInterval(i)
      }
    }
    isPressedDown = false
    dasCharged = false
    timeStartOfDAS = false
    timeStartOfARR = 0
    timeStartOfSDRR = 0
  }else if(e.key == controls.hardDrop){
    for(i=0;i<9999;i++){
      if (i !== timeInterval && i !== lockDelayTimeout && i !== softDropInterval && i !== moveInterval){
        clearInterval(i)
      }
    }
    lockDelayTimeout = null
  }else if(e.key == controls.hold){
    console.log("Hold key up")
  }else{
    console.log("keyupfunc error")
    console.log(e.key)
  }
}


//====================================================================

class Piece {
  constructor(shape, context){
    this.shape = shape
    this.context = context
    this.y = 0 //TODO: I think need to change this for guideline, pieces spawn at 21/22
    this.x = 3
    this.fromHoldQueue = false
    this.index = 0;
  }



  renderPiece(){
    this.shape.map((row, i) => {
      row.map((cell, j) => {
        if (cell > 0){ //Fills grid with color if not supposed to be empty(not 0)
          this.context.fillStyle = COLORS[cell]
          this.context.fillRect(this.x + j, this.y + i, 1, 1)
        }
      })
    })
  }

  //Collision detection
  //Given an x and y value, determine if a piece has collided with another object or sides of the map
  //Returns true if there is collision, which causes other functions to not work
  collision(x, y, candidate=null){ //Takes in current top left corner of the nxn matrix of the piece
    const shape =  candidate || this.shape
    const n = shape.length
    for (let i = 0; i < n; i++){ //Checks every block in the tetromino matrix
      for (let j = 0; j < n; j++){
        if (shape[i][j] > 0){  //If not empty block in the tetromino matrix
          let p = x + j
          let q = y + i
          if (p >= 0 && p < COLS && q < ROWS){
            //If any of the pieces touches another non-blank square, return true
            if (grid[q][p] > 0){
              return true
            }
          }
          else{
            return true
          }
        }
      }
    }
    return false
  }

  lockDelayTest(x,y){
    const shape = this.shape
    const n = shape.length
    loop1:
    for (let i = 0; i < n; i++){ //Checks every block in the tetromino matrix
      loop2:
      for (let j = 0; j < n; j++){
        if (shape[i][j] > 0){  //If not empty block in the tetromino matrix
          let p = x + j
          let q = y + i + 1 //This is the up down direction
          if (p >= 0 && p < COLS && q < ROWS){
            if (grid[q][p] > 0){
              this.landed = true
              break loop1;
            }
          }else if(q >= ROWS){
            this.landed = true
            break loop1;
          }else{
            this.landed = false
            this.waitingForLockDelay = false
          }
        }
      }
    }
    if (this.landed && !this.waitingForLockDelay){
      this.waitingForLockDelay = true
      this.lockDelayCountdown()
    }
    return false
  }

  lockDelayCountdown(){
    lockDelayTimeout = setTimeout(() => {
      if(this.landed == true){
        this.lockPiece()
        this.waitingForLockDelay = false
      }
    },LOCK_DELAY)
  }

  lockPiece(){
    if (this.landed == true){
      const shape = this.shape
      const x = this.x
      const y = this.y
      shape.map((row, i) => {
        row.map((cell, j) => {
          let p = x + j
          let q = y + i
          if (p >= 0 && p < COLS && q < ROWS && cell > 0){
            grid[q][p] = shape[i][j]
          }
        })
      holded = false
      })
      if (this.y === 0){
        alert("Game over!")
        stage = 0
      }
      currentPiece = null
      pieceCount ++
      document.getElementById("piece-count").textContent = "Piece: " +pieceCount
      newGameState()
    }
  }
}




class QueuePiece {
  constructor(shape, context){
    this.shape = shape
    this.context = context
    this.y = 0
    this.x = 0
  }

  renderQueuePiece(order){
    this.shape.map((row, i) => {
      row.map((cell, j) => {
        if (cell > 0){
          this.context.fillStyle = COLORS[cell]
          this.context.fillRect(this.x + j, this.y + i + ((order)*3), 1, 1)
        }
      })
    })
  }
}

class HoldPiece {
  constructor(shape, context){
    this.shape = shape
    this.context = context
    this.y = 0 //TODO: I think need to change this for guideline, pieces spawn at 21/22
    this.x = 0 //TODO: check guideline to see if this is how they make piece spawn in the middle
  }

  renderHoldPiece(){
    this.shape.map((row, i) => {
      row.map((cell, j) => {
        if (cell > 0){ //Fills grid with color if not supposed to be empty(not 0)
          this.context.fillStyle = COLORS[cell]
          this.context.fillRect(this.x+j, this.y+i+1, 1, 1)
        }
      })
    })
  }

}

