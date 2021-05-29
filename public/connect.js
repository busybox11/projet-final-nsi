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


//the code of the popup

var openmodal = document.querySelectorAll('.modal-open')
for (var i = 0; i < openmodal.length; i++) {
    openmodal[i].addEventListener('click', function(event) {
        event.preventDefault()
        toggleModal()
    })
}

const overlay = document.querySelector('.modal-overlay')
overlay.addEventListener('click', toggleModal)

var closemodal = document.querySelectorAll('.modal-close')
for (var i = 0; i < closemodal.length; i++) {
    closemodal[i].addEventListener('click', toggleModal)
}

document.onkeydown = function(evt) {
    evt = evt || window.event
    var isEscape = false
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc")
    } else {
        isEscape = (evt.keyCode === 27)
    }
    if (isEscape && document.body.classList.contains('modal-active')) {
        toggleModal()
    }
};

function toggleModal() {
    const body = document.querySelector('body')
    const modal = document.querySelector('.modal')
    modal.classList.toggle('opacity-0')
    modal.classList.toggle('pointer-events-none')
    body.classList.toggle('modal-active')
}