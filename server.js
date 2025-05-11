const express = require('express');
const app = express();


// An in memory varialbe that keeps log of all the users and their toto list.
const users = [];

app.use(express.static('public'));


app.get('/', function(req, res) {
    res.sendFile(__dirname + 'public/index.html');
});


app.listen(3000, ()=> {
    console.log("A request just hit the server...")
});