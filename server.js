const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();


const JWT_KEY = "onepunchman";

// An in memory varialbe that keeps log of all the users and their toto list.
const users = [];

app.use(express.json());

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + 'public/index.html');
});

function auth(req, res, next) {

    const token = req.headers.token;

    if(token) {
        const decoded = jwt.verify(token, JWT_KEY);
        if(users.find(u => u.username === decoded.username)) {
            req.username = decoded.username;
            next();
        } else {
            res.json({
                msg: "User doesn't exist"
            })
        }
    } else {
        res.send({
            msg: "Invalid token"
        })
    }

}

app.post('/sign-up', function(req, res) {
    
    console.log("Inside the signup endpoint");
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.username === username);

    if(user) {
        res.send({
            msg: "Username already exists"
        });
    } else {
        users.push({username: username, password: password});

        res.send({
            msg: "Successfully signed up"
        })
        console.log(users);
    }
    

});


app.post('/sign-in', function(req, res){

    console.log("Inside the signin endpoint");
    console.log(users);
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    

    const user = users.find(u => u.username === username && u.password === password);

    if(user) {
        const token = jwt.sign({username: username}, JWT_KEY);
        res.json({
            msg: "Successfully signed in",
            token: token
        })
    } else {
        res.send({
            msg: "Invalid username or password"
        })
    }
});

app.use(auth);

app.listen(3000, ()=> {
    console.log("A request just hit the server...")
});