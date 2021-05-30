var games
window.onload = function() {
    refreshGamesList()
}

function refreshGamesList() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", '/gamesList', false); // false for synchronous request
    xmlHttp.send(null);
    games = JSON.parse(xmlHttp.responseText);
    document.getElementById("gamesList").innerHTML = ``
    if (games.length <= 0) {
        document.getElementById("gamesList").innerHTML = "aucune partie, créez une partie vous même"
    } else {
        for (let game of games) {
            var gameCode = game.code
            document.getElementById("gamesList").innerHTML += `
            <a class="w-full p-2 bg-gray-800 flex inline-flex" href="/multi?code=${gameCode}">${gameCode}&nbsp;<p class="flex justify-end">${game.playersNb}/${game.infos.size}</p>&nbsp;<p class="flex justify-end">${game.infos.mode}</p></a>`
        }
    }
}
setInterval(refreshGamesList, 5000)