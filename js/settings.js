let controls = {
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  softDrop: "ArrowDown",
  hardDrop: " ",
  hold: "c",
  rotateClockwise: "ArrowUp",
  rotateCounterclockwise: "x",
  rotate180: "z",
  restart: "r",
}

let tuning = {
  delayedAutoShift: 100,
  automaticRepeatRate: 0,
  softDrop: 0,
}


function changeTuning(){
  //Dont need to implement new stage I think because eventually you wont be able to change tuning midgame
  newDas = window.prompt("Enter your DAS in millisecond (10-1000)")
  if (10 <= newDas <= 1000){
    tuning.delayedAutoShift = newDas
    document.getElementById("das-tuning").textContent = "DAS : "+tuning.delayedAutoShift
  }
  newArr = window.prompt("Enter your ARR in millisecond (0-100)")
  if (0 <= newArr <= 100){
    tuning.automaticRepeatRate = newArr
    document.getElementById("arr-tuning").textContent = "ARR : "+tuning.automaticRepeatRate
  }
}

