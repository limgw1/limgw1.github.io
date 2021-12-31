// const GAME_CLOCK = 1000/60 // 1000ms
const PIECE_WIDTH = 20 // This means each "block" in a column or row is 30 px
const ROWS = 20
const COLS = 10
const HOLDROWS = 5
const HOLDCOLS = 4
const QUEUEROWS = 20
const QUEUECOLS = 4
const LOCK_DELAY = 500

const SHAPES = [
  //Blank Piece
  [],
  // I piece
  [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0],
  ],
  // J piece
  [
    [2,0,0],
    [2,2,2],
    [0,0,0],
  ],
  // L piece
  [
    [0,0,3],
    [3,3,3],
    [0,0,0],
  ],
  // O piece
  [
    [4,4],
    [4,4],

  ],
  // S piece
  [
    [0,5,5],
    [5,5,0],
    [0,0,0],
  ],
  // T piece
  [
    [0,6,0],
    [6,6,6],
    [0,0,0],
  ],
  // Z piece
  [
    [7,7,0],
    [0,7,7],
    [0,0,0],
  ],
]

const COLORS = [
  '#000000',
  '#00FFFF',
  '#0000FF',
  '#FFAA00',
  '#FFFF00',
  '#00FF00',
  '#AA00FF',
  '#AA0000',
]

const NAMES = [
  "Blank",
  "I",
  "J",
  "L",
  "O",
  "S",
  "T",
  "Z"
]

const WALLKICKDATA = [
  //JLTSZ Tetromino Wall Kick Data
  [[-1,0],[-1,1],[0,-2],[-1,-2]],
  [[1,0],[1,-1],[0,2],[1,2]],

]