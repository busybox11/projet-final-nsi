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
            if(message.body<=1){
                document.getElementById("playerInLobbyNb").innerHTML = "sorry you are alone"
            }else{
                document.getElementById("playerInLobbyNb").innerHTML = `${message.body} players are waiting`;
            }
            break;
    
        case "gameUrl":
            window.location.replace(message.body)
            break;
        
        default:
            break;
    }
};