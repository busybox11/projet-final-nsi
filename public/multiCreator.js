function launchMultiGame(){
    if (ws.readyState) {
        ws.send(JSON.stringify({
            title: "launchMultiGame"
        }))
    } else {
        alert("ws not connected, please retry")
    }
}