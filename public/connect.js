var playerName
var players

window.onload = function() {
    loadUserName()
    if (!localStorage.getItem("inputTetris")) {
        localStorage.setItem("inputTetris", JSON.stringify({
            "left": [37, "ArrowLeft"],
            "right": [39, "ArrowRight"],
            "down": [40, "ArrowDown"],
            "rotate": [38, "ArrowUp"],
            "place": [32, "Space"],
            "hold": [16, "Shift"]
        }))
    }
}

function changeName() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", '/getPlayersName', false); // false for synchronous request
    xmlHttp.send(null);
    players = JSON.parse(xmlHttp.responseText);
    var newName = document.getElementById("newName").value
    if (!players.includes(newName)) {
        localStorage.setItem('userName', newName)
        return true
    }
    return false
}

function loadUserName() {
    playerName = localStorage.getItem('userName');
    if (!playerName) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", '/getAnonymousPlayerName', false); // false for synchronous request
        xmlHttp.send(null);
        playerName = JSON.parse(xmlHttp.responseText);
        localStorage.setItem('userName', playerName)
    }
    document.getElementById("connectedUserName").innerHTML = playerName
    document.getElementById("oldName").value = playerName
}