var ws = new WebSocket("ws://localhost:3000", "protocolOne");

ws.onopen = function(){
    ws.send(JSON.stringify({
        title: "newPlayerInLobby",
        body: ""
    }))
}
ws.onmessage = function(message) {
    message = JSON.parse(message.data)
    switch (message.title) {
        case "playerInLobbyNb":
            document.getElementById("playerInLobbyNb").innerHTML = message.body;
            break;
    
        case "gameUrl":
            window.location.replace(message.body)
            break;
        
        default:
            break;
    }
};