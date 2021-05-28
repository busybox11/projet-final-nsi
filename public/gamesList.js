var games
window.onload = function(){
    refreshGamesList()
}
function refreshGamesList(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", '/gamesList', false); // false for synchronous request
    xmlHttp.send(null);
    games = JSON.parse(xmlHttp.responseText);
    document.getElementById("gamesList").innerHTML= `` 
    if (games.length <= 0) {
        document.getElementById("gamesList").innerHTML = "aucune partie, créez une partie vous même"
    }else{
        for (let game of games) {
            var gameCode = game.code
            document.getElementById("gamesList").innerHTML += `<a href="/multi?code=${gameCode}">${gameCode}</a></br>` 
        }
    }
}
setInterval(refreshGamesList, 5000)