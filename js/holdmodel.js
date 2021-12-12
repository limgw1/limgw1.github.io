class HoldModel {
  constructor(context, currentHoldPiece = null){
    //Constructor is something you can grab from canvas
    this.context = context
    this.currentHoldPiece = currentHoldPiece
    this.grid = this.makeHoldGrid()
  }

  makeHoldGrid(){
    let grid = []
    for (var i = 0; i < HOLDROWS; i++){
      grid.push([]) //Pushes an empty array into grid for every row (20)
      for (var j = 0; j < HOLDCOLS; j++){
        grid[grid.length - 1].push(0) //Creates a 20x10 array with all 0s
      }
    }
    return grid
  }

  renderHoldState(){
    //Renders the board
    for (let i = 0; i < this.grid.length; i++){
      for (let j=0; j < this.grid[i].length; j++){
        let cell = this.grid[i][j]
        this.context.fillStyle = COLORS[cell]
        this.context.fillRect(j, i, 1, 1)
      }
    }
    //Renders the hold piece
    if (this.currentHoldPiece !== null){
      this.currentHoldPiece.renderHoldPiece()
    }
  }

}