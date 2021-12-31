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

function loadControls(){
  let listOfKeys = Object.keys(controls)
  let listOfValues = Object.values(controls)
  for(i=0; i<listOfKeys.length; i++){
    node = document.createElement("li")
    textNode = document.createTextNode(listOfKeys[i]+" : "+listOfValues[i])
    node.appendChild(textNode)
    document.getElementById("control-list").appendChild(node)
  }
}

function loadTuning(){
  let listOfKeys = Object.keys(tuning)
  let listOfValues = Object.values(tuning)
  for(i=0; i<listOfKeys.length; i++){
    node = document.createElement("li")
    textNode = document.createTextNode(listOfKeys[i]+" : "+listOfValues[i])
    node.appendChild(textNode)
    document.getElementById("tuning-list").appendChild(node)
  }
}

function openControlsModal(){
  renderControls()
  modal = document.getElementById("change-controls-modal")
  modal.style.display = "block"
}

function openTuningModal(){
  renderTuning()
  modal = document.getElementById("change-tuning-modal")
  modal.style.display = "block"
}

function saveAndCloseControlsModal(){
  stage = 0
  modal = document.getElementById("change-controls-modal")
  modal.style.display = "none"
  let listOfKeys = Object.keys(controls)
  //Code to unrender all the elements rendered by renderControls()
  let loopLength = document.getElementsByClassName("control-input-label").length
  let myObj = document.getElementsByClassName("control-input-label")
  let myObj2 = document.getElementsByClassName("control-input-div")
  for(i=0; i<loopLength; i++){
    myObj[0].remove()
    myObj2[0].remove()
    //Save keys to local storage line of code
    localStorage.setItem(listOfKeys[i],controls[listOfKeys[i]])
  }
  saveTuningAndControlToLocalStorage()
  unloadControls()
  loadControls()
}

function saveAndCloseTuningModal(){
  stage = 0
  modal = document.getElementById("change-tuning-modal")
  modal.style.display = "none"
  let listOfKeys = Object.keys(tuning)
  for(i=0; i<listOfKeys.length; i++){
    let elementValue = parseInt(document.getElementById(listOfKeys[i]+"-input").value)
    if (elementValue <= 1000 && elementValue >= 0){
      tuning[listOfKeys[i]] = elementValue
    }else if(elementValue > 1000){
      tuning[listOfKeys[i]] = 1000
    }else if(elementValue < 0){
      tuning[listOfKeys[i]] = 0
    }else{
      tuning[listOfKeys[i]] = 0
    }
  }
  //Code to unrender all the elements rendered by renderTuning()
  let loopLength = document.getElementsByClassName("tuning-input-label").length
  let myObj = document.getElementsByClassName("tuning-input-label")
  let myObj2 = document.getElementsByClassName("control-tuning-div")
  for(i=0; i<loopLength; i++){
    myObj[0].remove()
    myObj2[0].remove()
  }
  saveTuningAndControlToLocalStorage()
  unloadTuning()
  loadTuning()
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

function renderTuning(){
  stage = 4
  //Dont need to implement new stage I think because eventually you wont be able to change tuning midgame
  let listOfKeys = Object.keys(tuning)
  let listOfValues = Object.values(tuning)
  for(i=0; i<listOfKeys.length; i++){
    //Creates the text
    let modal = document.getElementById("actual-tuning-label")
    let node = document.createElement("div")
    node.className = "tuning-input-label"
    let textNode = document.createTextNode(listOfKeys[i])
    node.appendChild(textNode)
    modal.appendChild(node)
    //Creates input div
    let inputModal = document.getElementById("actual-tuning-input")
    let inputDivNode = document.createElement("div")
    inputDivNode.className = "control-tuning-div"
    inputDivNode.id = listOfKeys[i]
    inputModal.appendChild(inputDivNode)
    //Creates the input
    let inputDivModal = document.getElementById(listOfKeys[i])
    let inputNode = document.createElement("input")
    inputNode.className = "tuning-input-input"
    inputNode.type =
    inputNode.id = listOfKeys[i] + "-input"
    let inputTextNode = document.createTextNode(listOfValues[i])
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

function unloadControls(){
  let listOfKeys = Object.keys(controls)
  let listOfValues = Object.values(controls)
  for(i=0; i<listOfKeys.length; i++){
    document.getElementById("control-list").children[0].remove()
  }
}

function unloadTuning(){
  let listOfKeys = Object.keys(tuning)
  let listOfValues = Object.values(tuning)
  for(i=0; i<listOfKeys.length; i++){
    document.getElementById("tuning-list").children[0].remove()
  }
}

function saveTuningAndControlToLocalStorage(){
  let listOfKeys = Object.keys(tuning)
  for(i=0; i<listOfKeys.length; i++){
    localStorage.setItem(listOfKeys[i],tuning[listOfKeys[i]])
  }
  listOfKeys = Object.keys(controls)
  for(i=0; i<listOfKeys.length; i++){
    localStorage.setItem(listOfKeys[i],controls[listOfKeys[i]])
  }
}

function initializeControlsAndTuning(){
  if (localStorage.length == 12){
    let listOfKeys = Object.keys(controls)
    for(i=0; i<listOfKeys.length; i++){
      let tempValue = localStorage.getItem(listOfKeys[i])
      controls[listOfKeys[i]] = tempValue
    }
    listOfKeys = Object.keys(tuning)
    for(i=0; i<listOfKeys.length; i++){
      let tempValue = localStorage.getItem(listOfKeys[i])
      tuning[listOfKeys[i]] = tempValue
    }
  }
}

