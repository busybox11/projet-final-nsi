const express = require("express");

const app = express();

app.use(express.static(__dirname + '/public/'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.get("/tetris", (req, res) => {
    res.sendFile(__dirname + '/views/tetris.html')
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});