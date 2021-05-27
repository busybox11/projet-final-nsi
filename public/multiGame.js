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
    switch (message.title) {
        case "newPlayer":
            document.getElementById("playersNb").innerHTML = message.body
            break;
        default:
            break;
    }
}
ws.onclose = function() {
    window.location.replace("/")
}