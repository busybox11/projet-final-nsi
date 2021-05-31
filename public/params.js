var inputTetris
window.onload = function() {
    if (!localStorage.getItem("inputTetris")) window.location.replace("/")
    inputTetris = JSON.parse(localStorage.getItem("inputTetris"))
    document.getElementById("downKey").innerHTML = inputTetris["down"][1]
    document.getElementById("leftKey").innerHTML = inputTetris["left"][1]
    document.getElementById("rightKey").innerHTML = inputTetris["right"][1]
    document.getElementById("rotateKey").innerHTML = inputTetris["rotate"][1]
    document.getElementById("placeKey").innerHTML = inputTetris["place"][1]
    document.getElementById("holdKey").innerHTML = inputTetris["hold"][1]
    document.getElementById("pauseKey").innerHTML = inputTetris["pause"][1]
}
var target
function changeKey(event) {
    target = event.target.id
    document.addEventListener("keydown", keypressed)
}

function keypressed(e){
    document.removeEventListener("keydown", keypressed)
    var name = e.key
    if (!name.trim().length) name = e.code
    inputTetris[target.split("Key")[0]] = [e.keyCode, name]
    document.getElementById(target).innerHTML = inputTetris[target.split("Key")[0]][1]
    localStorage.setItem("inputTetris", JSON.stringify(inputTetris))
}
