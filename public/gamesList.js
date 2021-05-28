window.onload = function(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", '/gamesList', false); // false for synchronous request
    xmlHttp.send(null);
    var games = JSON.parse(xmlHttp.responseText);
    console.log(games)
}