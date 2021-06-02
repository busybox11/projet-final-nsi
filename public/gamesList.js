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
        document.getElementById("gamesList").innerHTML = "<span class='text-gray-300'>Aucune partie multijoueur trouvée</span>"
    } else {
        for (let game of games) {
            var gameCode = game.code
            document.getElementById("gamesList").innerHTML += `
                <a class="w-full px-4 py-2 bg-gray-800 flex flex-col font-joystix leading-4" href="/multi?code=${gameCode}">
                    <h4 class="text-3xl">${gameCode}</h4>
                    <p class="text-gray-300">${game.playersNb}/${game.infos.size} players</p>
                    <p class="text-gray-300">${game.infos.mode}</p>
                </a>`
        }
    }
}
setInterval(refreshGamesList, 5000)