//Game model is where the core logic of the entire tetris game is at
class GameModel {
  constructor(context){
    //Constructor is something you can grab from canvas
    this.context = context
    this.fallingPiece = null
    this.grid = this.makeStartingGrid()
  }

  makeStartingGrid(){
    let grid = []
    for (var i = 0; i < ROWS; i++){
      grid.push([]) //Pushes an empty array into grid for every row (20)
      for (var j = 0; j < COLS; j++){
        grid[grid.length - 1].push(0) //Creates a 20x10 array with all 0s
      }
    }
    return grid
  }


  //Collision detection
  //Given an x and y value, determine if a piece has collided with another object or sides of the map
  //Returns true if there is collision, which causes other functions to not work
  collision(x,y, candidate=null){ //Takes in current top left corner of the nxn matrix of the piece
      const shape = candidate || this.fallingPiece.shape
      const n = shape.length
      for (let i = 0; i < n; i++){ //Checks every block in the tetromino matrix
        for (let j = 0; j < n; j++){
          if (shape[i][j] > 0){  //If not empty block in the tetromino matrix
            let p = x + j
            let q = y + i
            if (p >= 0 && p < COLS && q < ROWS){
              //If any of the pieces touches another non-blank square, return true
              if (this.grid[q][p] > 0){
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


  renderGameState(){
    //Renders the board
    for (let i = 0; i < this.grid.length; i++){
      for (let j=0; j < this.grid[i].length; j++){
        let cell = this.grid[i][j]
        this.context.fillStyle = COLORS[cell]
        this.context.fillRect(j, i, 1, 1)
      }
    }
    //Renders falling piece
    if (this.fallingPiece !== null){
      this.fallingPiece.renderPiece()
    }
  }

  //Soft Drop and Gravity
  moveDown(){
    if (this.fallingPiece === null){
      this.renderGameState() //Renders game state if no pieces to move down
      return
    } else if (this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)){
    //All this code is for if the piece hits another piece
    //TODO: Add lock delay
      const shape = this.fallingPiece.shape
      const x = this.fallingPiece.x
      const y = this.fallingPiece.y
      shape.map((row, i) => {
        row.map((cell, j) => {
          let p = x + j
          let q = y + i
          if (p >= 0 && p < COLS && q < ROWS && cell > 0){
            this.grid[q][p] = shape[i][j]
          }
        })
      holded = false
      })

      //Check for game over
      //TODO: Change to guideline topout mechanics
      if (this.fallingPiece.y === 0){
        alert("Game over!")
        this.grid = this.makeStartingGrid()
      }
      this.fallingPiece = null
      pieceCount ++
      document.getElementById("piece-count").innerHTML = pieceCount
    }else{
      this.fallingPiece.y += 1
    }
    this.renderGameState()
  }

  // Logic for moving left to right
  move(right){
    //Check if piece is rendered
    if (this.fallingPiece === null){
      return
    }

    let x = this.fallingPiece.x
    let y = this.fallingPiece.y
    if (right) {
      //move right
      if (!this.collision(x+1,y)){
        this.fallingPiece.x += 1
      }
    }else{
      //move left
      if (!this.collision(x-1, y)){
        this.fallingPiece.x -= 1
      }
    }
    this.renderGameState()
  }

  //TODO: Rework this entire thing to fit SRS rotation system
  rotateClockwise(){
    if (this.fallingPiece !== null){
      let shape = [...this.fallingPiece.shape.map((row) => [...row])]
      // Transpose Matrix (basically rotation)
      for (let y = 0; y< shape.length; y++){
        for (let x = 0; x < y; x++){
          [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]]
        }
      }
      // Reverse order of rows
      shape.forEach((row => row.reverse()))
      if (!this.collision(this.fallingPiece.x, this.fallingPiece.y, shape)) {
        this.fallingPiece.shape = shape
      }
    }
    this.renderGameState()
  }

  rotateCounterClockwise(){
    if (this.fallingPiece !== null){
      let shape = [...this.fallingPiece.shape.map((row) => [...row])]
      // Reverse order of rows
      shape.forEach((row => row.reverse()))
      // Transpose Matrix (basically rotation)
      for (let y = 0; y< shape.length; y++){
        for (let x = 0; x < y; x++){
          [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]]
        }
      }
      if (!this.collision(this.fallingPiece.x, this.fallingPiece.y, shape)) {
        this.fallingPiece.shape = shape
      }
    }
    this.renderGameState()
  }

  rotate180(){
    if (this.fallingPiece !== null){
      let shape = [...this.fallingPiece.shape.map((row) => [...row])]
      // Reverse order of rows
      shape.reverse()
      shape.forEach((row => row.reverse()))
      if (!this.collision(this.fallingPiece.x, this.fallingPiece.y, shape)) {
        this.fallingPiece.shape = shape
      }
    }
    this.renderGameState()
  }

  hardDrop(){
    //Take current piece
    //Check how many blocks down it can go before it hits another piece
    //Go down that many pieces
    //Immediately render game state
    if (this.fallingPiece !== null){
      const shape = this.fallingPiece.shape
      const x = this.fallingPiece.x
      const y = this.fallingPiece.y
      while(!this.collision(x,y+1)){
        if (this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)){
          //All this code is for if the piece hits another piece
          //TODO: Add lock delay
            const shape = this.fallingPiece.shape
            const x = this.fallingPiece.x
            const y = this.fallingPiece.y
            shape.map((row, i) => {
              row.map((cell, j) => {
                let p = x + j
                let q = y + i
                if (p >= 0 && p < COLS && q < ROWS && cell > 0){
                  this.grid[q][p] = shape[i][j]
                }
              })
            })
          break
          }else{
            this.fallingPiece.y += 1
          }
      }
      this.moveDown()
    }
  }

}
