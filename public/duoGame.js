var ws = new WebSocket("ws://localhost:3000", "protocolOne");

ws.onopen = function(){
    var url = new URL(window.location.href);
    var gameCode = url.searchParams.get("code");
    ws.send(JSON.stringify({
        title: "connectToTheDuoGame",
        body: {
            gameCode: gameCode,
            playerName: "playerName"
        }
    }))
}
ws.onmessage = function(message){
    message = JSON.parse(message.data)
    console.log(message)
    switch (message.title) {
        case "opponentName":
            document.getElementById("opponentName").innerHTML = message.body;
            break;
        
        case "opponentLeftGame":
            window.location.replace("/lobby")
            break;

        default:
            break;
    }
}
ws.onclose = function(){
    window.location.replace("/")
}