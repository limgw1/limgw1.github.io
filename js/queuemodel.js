class QueueModel {
  constructor(context){
    //Constructor is something you can grab from canvas
    this.context = context
    this.queueArray = null
    this.grid = this.makeQueueGrid()
  }

  makeQueueGrid(){
    let grid = []
    for (var i = 0; i < QUEUEROWS; i++){
      grid.push([]) //Pushes an empty array into grid for every row (20)
      for (var j = 0; j < QUEUECOLS; j++){
        grid[grid.length - 1].push(0) //Creates a 20x10 array with all 0s
      }
    }
    return grid
  }

  renderQueueState(){
    //Renders the board
    for (let i = 0; i < this.grid.length; i++){
      for (let j = 0; j < this.grid[i].length; j++){
        let cell = this.grid[i][j]
        this.context.fillStyle = COLORS[cell]
        this.context.fillRect(j, i, 1, 1)
      }
    }
    //TODO: Render the queue piece
    for (let i = 0; i < this.queueArray.length-1; i++){
      this.queueArray[i+1].renderQueuePiece(i)
    }


  }

}