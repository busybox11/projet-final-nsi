var playerName
var players

loadUserName()
if (!localStorage.getItem("inputTetris")) {
    localStorage.setItem("inputTetris", JSON.stringify({
        "left": [37, "ArrowLeft"],
        "right": [39, "ArrowRight"],
        "down": [40, "ArrowDown"],
        "rotate": [38, "ArrowUp"],
        "place": [32, "Space"],
        "hold": [16, "Shift"],
        "pause": [84, "t"]
    }))
}


function changeName() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", '/getPlayersName', false); // false for synchronous request
    xmlHttp.send(null);
    players = JSON.parse(xmlHttp.responseText);
    var newName = document.getElementById("newName").value
    if (!players.includes(newName) && newName.trim().length >= 3 && newName.trim().length <= 20) {
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
    try {
        document.getElementById("connectedUserName").innerHTML = playerName
        document.getElementById("oldName").value = playerName
    } catch (error) {
        //
    }
}