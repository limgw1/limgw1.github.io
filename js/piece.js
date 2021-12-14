class Piece {
  constructor(shape, context){
    this.shape = shape
    this.context = context
    this.y = 0 //TODO: I think need to change this for guideline, pieces spawn at 21/22
    this.x = Math.floor(COLS/2) //TODO: check guideline to see if this is how they make piece spawn in the middle
    this.fromHoldQueue = false
    this.das = 0;
    this.arr = 0;
    this.lockDelay = 0;
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

  move(right){
    if (right) {
      //move right
      if (!this.collision(this.x+1,this.y)){
        this.x += 1
      }
    }else if (!this.collision(this.x-1, this.y)) {
      //move left
      if (!this.collision(this.x-1, this.y)){
        this.x -= 1
      }
    }
    renderGameState()
  }

  //Collision detection
  //Given an x and y value, determine if a piece has collided with another object or sides of the map
  //Returns true if there is collision, which causes other functions to not work
  collision(x,y, candidate=null){ //Takes in current top left corner of the nxn matrix of the piece
    const shape = candidate || this.shape
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
            //TODO: If any piece ccw and touches another non-blank square, return true
            //TODO: If any piece cw and touches another non-blank square, return true
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
    //All this code is for if the piece hits another piece
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

      //Check for game over
      if (this.y === 0){
        alert("Game over!")
        grid = this.makeStartingGrid()
      }
      currentPiece = null
      pieceCount ++
      document.getElementById("piece-count").innerHTML = "Piece: " +pieceCount
    }else{
      this.y += 1
    }
    newGameState()
  }

  hardDrop(){
  //Take current piece
  //Check how many blocks down it can go before it hits another piece
  //Go down that many pieces
  //Immediately render game state
    const shape = this.shape
    while(!this.collision(this.x,this.y+1)){
      if (this.collision(this.x, this.y+1)){
        //All this code is for if the piece hits another piece
        //TODO: Add lock delay
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
        break
        }else{
          this.y += 1
      }
    }
    this.moveDown()
    currentPiece = null
    holded = false
    newGameState()
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
          this.context.fillRect(this.x + j, this.y + i, 1, 1)
        }
      })
    })
  }
}