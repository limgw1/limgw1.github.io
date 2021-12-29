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
    this.settingsSDRR = null
    this.isPressedDown = false;
    this.dasCharged = false;
    this.timeStartofDAS = 0;
    this.timeStartofARR = 0;
    this.timeStartofSDRR = 0;
    this.moveInterval = null;
    this.softDropInterval = null;
    this.lockDelayTimeout = null;
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
      this.timeStartOfDAS = Date.now()
      this.isPressedDown = true
      //Had to set it up like that in order to clear it on keyUpFunc
      this.moveInterval
    }
  }

  mainSoftDropFunction(e){
    this.softDropInterval = setInterval(() => {
      if (this.isPressedDown){
        this.moveDown()
      }
    },4)
    if (e.key == controls.softDrop){
      this.moveDown()
      this.timeStartOfSDRR = Date.now()
      this.isPressedDown = true
      this.softDropInterval()
    }
  }

  move(e){
    if ((e.key == controls.moveLeft || e.key == controls.moveRight) && !this.dasCharged && this.isPressedDown){
      if (Date.now() - this.timeStartOfDAS >= this.settingsDAS){
          this.dasCharged = true
          this.timeStartOfARR = Date.now()
      }
      this.isPressedDown = true
      }else if((e.key == controls.moveLeft || e.key == controls.moveRight) && this.dasCharged && this.isPressedDown){
        if ((Date.now() - this.timeStartOfARR) >= this.settingsARR){
              this.translate(e)
              this.timeStartOfARR = Date.now()
          }
      }
  }

  keyupFunc(e){
    if((e.key == controls.moveLeft || e.key == controls.moveRight || e.key == controls.softDrop) && this.isPressedDown){
      for(i=0;i<9999;i++){
        if (i !== timeInterval && i !== this.lockDelayTimeout){
          clearInterval(i)
        }
      }
      this.isPressedDown = false
      this.dasCharged = false
      this.timeStartOfDAS = 0
      this.timeStartOfARR = 0
      this.timeStartOfSDRR = 0
      this.moveInterval = null
      this.softDropInterval = null
      this.lockDelayTimeout = null
    }else{
        console.log("keyupfunc error")
    }
  }

  translate(e){
    if (e.key == controls.moveRight && this.settingsARR == 0 && this.dasCharged) {
      //move all the way right
      while(!this.collision(this.x+1, this.y)){
        if (this.collision(this.x+1, this.y)){
        }else{
          this.x += 1
        }
      }
    }else if (e.key == controls.moveLeft && this.settingsARR == 0 && this.dasCharged){
      //move all the way left
      while(!this.collision(this.x-1, this.y)){
        if (this.collision(this.x-1, this.y)){
        }else{
          this.x -= 1
        }
      }
    }else if (e.key == controls.moveRight) {
      //move right
      if (!this.collision(this.x+1,this.y)){
        this.x += 1
        this.landed = false
        this.waitingForLockDelay = false
      }else if(this.collision(this.x+1,this.y)){
        this.lockDelayTest()
      }
    }else if (e.key == controls.moveLeft){
      //move left
      if (!this.collision(this.x-1, this.y)){
        this.x -= 1
        this.landed = false
        this.waitingForLockDelay = false
      }else if(this.collision(this.x-1,this.y)){
        this.lockDelayTest()
      }
    }else{
      console.log("Errors")
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
    if (tuning.softDropRepeatRate == 0){
      while(!this.collision(this.x, this.y+1)){
        if (this.collision(this.x, this.y+1)){
        break
        }else{
          this.y += 1
        }
      }
    }else{
      if (this.timeStartofSDRR == 0){
        this.timeStartofSDRR = Date.now()
      }
      if (Date.now() - this.timeStartofSDRR >= this.settingsSDRR){
        if (this.collision(this.x, this.y+1)){
        }else{
          this.y += 1
        }
        this.timeStartofSDRR = 0
      }
    }
    newGameState()
  }

  hardDrop(){
    //CHANGE THIS CODE IF THERE IS ANOTHER TIMEOUT IN THE FUTURE
    for(i=0;i<999;i++){
      if (i !== this.moveInterval && i !== timeInterval && i !== this.softDropInterval){
        clearTimeout(i)
      }
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
              console.log("landed 1")
              this.landed = true
              break loop1;
            }
          }else if(q >= ROWS){
            console.log("landed 2")
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
      console.log("lockdelaycountdown initiated")
      this.lockDelayCountdown()
      this.waitingForLockDelay = true
    }
    return false
  }

  lockDelayCountdown(){
    console.log("Countdown initiated")
    this.lockDelayTimeout = setTimeout(() => {
      if(this.landed == true){
        this.lockPiece()
        console.log("lockdelay false 2")
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

