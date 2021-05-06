const express = require("express");

const app = express();

app.use(express.static(__dirname + '/public/'));

app.get("/", (req, res) => {
   res.sendFile(__dirname + '/views/index.html')
});

app.post("/", (req, res) => {
   res.send("This is home page with post request.");
});

// PORT
const PORT = 3000;

app.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});
