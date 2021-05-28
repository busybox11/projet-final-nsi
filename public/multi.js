var ws = new WebSocket(`ws:${window.location.host}//`, "protocolOne");
ws.onopen = function() {
    var url = new URL(window.location.href);
    var gameCode = url.searchParams.get("code");
    var userName = localStorage.getItem("userName")
    if (!userName) {
        userName = "anonymous"
    }
    ws.send(JSON.stringify({
        title: "connectToTheGame",
        body: {
            gameCode: gameCode,
            playerName: userName
        }
    }))
}
ws.onmessage = function(message) {
    message = JSON.parse(message.data)
    console.log(message)
    switch (message.title) {
        case "updatePlayers":
            document.getElementById("playersNb").innerHTML = `${message.body.nbInGame} / ${message.body.size}`
            break;
        
        case "beginMultiGame":
            alert("begining")
            break;

        case "errorLaunchingGame":
            alert(message.body)
            break;

        case "creatorLeftTheGame":
            alert("désolé le createur a quitté la partie vous allez être redirigé")
            window.location.replace("/")
            break;

        default:
            break;
    }
}
ws.onclose = function() {
    window.location.replace("/")
}