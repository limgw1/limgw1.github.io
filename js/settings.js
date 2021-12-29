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
  softDropRepeatRate: 0,
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
  newSdrr = window.prompt("Enter your soft drop repeat rate in millisecond (0-100)")
  if (0 <= newSdrr <= 100){
    tuning.softDropRepeatRate = newSdrr
    document.getElementById("sdrr-tuning").textContent = "SDRR : "+tuning.softDropRepeatRate
  }
}

function loadControls(){
  listOfKeys = Object.keys(controls)
  listOfValues = Object.values(controls)
  for(i=0; i<listOfKeys.length; i++){
    node = document.createElement("li")
    textNode = document.createTextNode(listOfKeys[i]+" : "+listOfValues[i])
    node.appendChild(textNode)
    document.getElementById("control-list").appendChild(node)
  }
}

function openControlsModal(){
  renderControls()
  modal = document.getElementById("change-controls-modal")
  modal.style.display = "block"
}

function saveAndCloseControlsModal(){
  stage = 0
  console.log("Solmi cute")
  modal = document.getElementById("change-controls-modal")
  modal.style.display = "none"
  //Code to unrender all the elements rendered by renderControls()
  let loopLength = document.getElementsByClassName("control-input-label").length
  let myObj = document.getElementsByClassName("control-input-label")
  let myObj2 = document.getElementsByClassName("control-input-div")
  for(i=0; i<loopLength; i++){
    myObj[0].remove()
    myObj2[0].remove()
  }
}

function renderControls(){
  let listOfKeys = Object.keys(controls)
  let listOfValues = Object.values(controls)
  for(i=0; i<listOfKeys.length; i++){
    //Creates the text
    let modal = document.getElementById("actual-control-label")
    let node = document.createElement("div")
    node.className = "control-input-label"
    let textNode = document.createTextNode(listOfKeys[i])
    node.appendChild(textNode)
    modal.appendChild(node)
    //Creates input div
    let inputModal = document.getElementById("actual-control-input")
    let inputDivNode = document.createElement("div")
    inputDivNode.className = "control-input-div"
    inputDivNode.id = listOfKeys[i]
    inputModal.appendChild(inputDivNode)
    //Creates the button
    let inputDivModal = document.getElementById(listOfKeys[i])
    let inputNode = document.createElement("button")
    inputNode.className = "control-input-button"
    inputNode.id = listOfKeys[i] + "-button"
    inputNode.setAttribute("onclick","changeKey('"+listOfKeys[i]+"')")
    let inputTextNode //Initializes with no value
    if (listOfValues[i] == " "){
      inputTextNode = document.createTextNode("Spacebar")
    }else{
      inputTextNode = document.createTextNode(listOfValues[i])
    }
    inputNode.appendChild(inputTextNode)
    inputDivModal.appendChild(inputNode)
  }
}

function changeKey(key){
  //Destructuring assignment cant work idk why
  stage = 4
  document.getElementById(key+"-button").innerText = "Press any key"
  document.addEventListener("keydown", (e) => {
    e.preventDefault()
    if (stage == 4){
      if(Object.values(controls).includes(e.key)){
        controls[key] = null
        document.getElementById(key+"-button").innerText = "Try another key"
      }else{
        controls[key] = e.key
        document.getElementById(key+"-button").innerText = e.key
      }
    }
  })
}


