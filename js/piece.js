class Piece {
  constructor(shape, context){
    this.shape = shape
    this.context = context
    this.y = 0 //TODO: I think need to change this for guideline, pieces spawn at 21/22
    this.x = Math.floor(COLS/2) //TODO: check guideline to see if this is how they make piece spawn in the middle
    this.fromHoldQueue = false
    this.index = 0;
    //Vars for lock delay
    this.landed = false;
    this.lockDelay = 0;
    this.waitingForLockDelay = false;
    //For DAS and ARR
    this.settingsDAS = null
    this.settingsARR = null
    this.isPressedDown = false;
    this.dasCharged = false;
    this.timeStartofDAS = 0;
    this.timeStartofARR = 0;
    this.moveInterval = null;
  }

  checkSpawn(x =this.x, y = this.y, candidate=null){
    const shape =  candidate || this.shape
    const n = shape.length
    if (this.collision(x, y+1, shape)){
      this.lockDelayTest(x, y)
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

  mainMoveFunction(e){
    this.moveInterval = setInterval(() => {this.move(e)},4)
    if ((e.key == controls.moveLeft || e.key == controls.moveRight) && !this.isPressedDown){
      this.translate(e)
      this.timeOfStartDAS = Date.now()
      this.isPressedDown = true
      //Had to set it up like that in order to clear it on keyUpFunc
      this.moveInterval
    }
  }

  move(e){
    if ((e.key == controls.moveLeft || e.key == controls.moveRight) && !this.dasCharged && this.isPressedDown){
      if (Date.now() - this.timeOfStartDAS >= this.settingsDAS){
          this.dasCharged = true
          this.timeOfStartARR = Date.now()
      }
      this.isPressedDown = true
      }else if((e.key == controls.moveLeft || e.key == controls.moveRight) && this.dasCharged && this.isPressedDown){
        if ((Date.now() - this.timeOfStartARR) >= this.settingsARR){
              this.translate(e)
              this.timeOfStartARR = Date.now()
          }
      }
  }

  keyupFunc(e){
    if((e.key == controls.moveLeft || e.key == controls.moveRight) && this.isPressedDown){
        this.isPressedDown = false
        this.dasCharged = false
        this.timeOfStartDAS = 0
        this.timeOfStartARR = 0
        this.moveInterval = null
        for(i=0;i<999;i++){
          if (i !== timeInterval){
            clearInterval(i)
          }
        }
    }else{
        console.log("error")
    }
  }

  translate(e){
    if (e.key == "ArrowRight") {
      //move right
      if (!this.collision(this.x+1,this.y)){
        this.x += 1
        this.landed = false
        this.waitingForLockDelay = false
      }
    }else if (e.key == "ArrowLeft"){
      //move left
      if (!this.collision(this.x-1, this.y)){
        this.x -= 1
        this.landed = false
        this.waitingForLockDelay = false
      }
    }else{
      console.log("Error")
    }

    renderGameState()
    this.lockDelayTest(this.x, this.y)
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

  rotateClockwise(){
    let shape = [...this.shape.map((row) => [...row])]
    // Transpose Matrix (basically rotation)
    for (let y = 0; y< shape.length; y++){
      for (let x = 0; x < y; x++){
        [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]]
      }
    }
    // Reverse order of rows
    shape.forEach((row => row.reverse()))
    if (!this.collision(this.x, this.y, shape)) {
      this.shape = shape
    }
    renderGameState()
    this.lockDelayTest(this.x, this.y)
  }

  rotateCounterClockwise(){
    let shape = [...this.shape.map((row) => [...row])]
    // Reverse order of rows
    shape.forEach((row => row.reverse()))
    // Transpose Matrix (basically rotation)
    for (let y = 0; y< shape.length; y++){
      for (let x = 0; x < y; x++){
        [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]]
      }
    }
    if (!this.collision(this.x, this.y, shape)) {
      this.shape = shape
    }
    renderGameState()
    this.lockDelayTest(this.x, this.y)
  }

  rotate180(){
    let shape = [...this.shape.map((row) => [...row])]
    // Reverse order of rows
    shape.reverse()
    shape.forEach((row => row.reverse()))
    if (!this.collision(this.x, this.y, shape)) {
      this.shape = shape
    }
    renderGameState()
  }

  moveDown(){
    if (this.collision(this.x, this.y+1)){
    }else{
      this.y += 1

    }
    newGameState()
  }

  hardDrop(){
    //CHANGE THIS CODE IF THERE IS ANOTHER TIMEOUT IN THE FUTURE
    for(i=0;i<999;i++){
      clearTimeout(i)
    }
    const shape = this.shape
    let x = this.x
    let y = this.y
    while(!this.collision(x, y+1)){
      if (this.collision(x, y+1)){
      break
      }else{
        y += 1
      }
    }
    if (this.collision(x, y+1)){
      const shape = this.shape
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
      this.lockDelayCountdown()
      this.waitingForLockDelay = true
    }
    return false
  }

  lockDelayCountdown(){
    setTimeout(() => {
      if(this.landed == true){
        this.lockPiece()
        this.waitingForLockDelay = false
      }
    },LOCK_DELAY)
  }

  // lockDelayCountdown(){
  //   let lockdelayTimeReached = false
  //   let a = Date.now()
  //   let b = 0
  //   while(!lockdelayTimeReached && (this.landed == true)){
  //     b = Date.now()
  //     if ((b-a) < LOCK_DELAY){
  //       lockdelayTimeReached = false
  //     }else{
  //       lockdelayTimeReached = true
  //     }
  //     }
  //   }

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
      console.log("Turning piece null")
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

