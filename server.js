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
    // console.log("inside the auth");
    try {
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
    }catch(error) {
        console.error(error);
        res.status(500).json({ msg: "An error occurred while fetching the todos." });  
    }
    
}

app.post('/sign-up', function(req, res) {
    
    // console.log("Inside the signup endpoint");
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.username === username);

    if(user) {
        res.send({
            msg: "Username already exists"
        });
    } else {
        users.push({username: username, password: password, todos: []});

        res.send({
            msg: "Successfully signed up"
        })
        console.log(users);
    }
    

});


app.post('/sign-in', function(req, res){

    // console.log("Inside the signin endpoint");
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
        });
    }
});

app.use(auth);


app.post('/add-todo', function(req, res) {
    // console.log("inside the add-todo");
    try {
        const user = users.find(u=> u.username === req.username);
        const task = req.body.task;
        const len = user.todos.length;
        user.todos.push({id: `${len}`, task: task, completed: false});
        res.send({
            msg: "Todo successfully added"
        });
    } catch(error) {
        console.error(error);
        res.status(500).send({msg: "An error occured while adding the todo."});
    }
})


app.post('/update-todo', function(req, res){
    // console.log("inside the update-todo");
    try {
        const user = users.find(u=> u.username === req.username);
        const todo = user.todos.find(u => u.id == req.body.id);
        todo.task = req.body.task;
        res.send({
            msg: "Todo has been updated successfully"
        });
    } catch(error) {
        console.error(error);
        res.status(500).send({msg: "An error occured while updating the todo."});
    }
});

app.post('/delete-todo', function(req, res) {
    console.log("inside the delete todo route handler.")
    try {
        const user = users.find(u=> u.username === req.username);
        const index = user.todos.findIndex(u => u.id === req.body.id);
        user.todos.splice(index, 1);
        res.send({
            msg: "Todo deleted successfully"
        })
    } catch(error) {
        console.error(error);
        res.status(500).send({msg: "An error occured while deleting the todo."});
    }
});

app.get('/me', function(req, res) {
    // console.log("inside the me endpoint");
    try {
        const user = users.find(u=> u.username === req.username);
        res.json({
            todos: user.todos
        })
    }catch(error) {
        console.error(error);
        res.status(500).send({msg: "An error occured while fetching the todo."});
    }
});

app.listen(3000, ()=> {
    console.log("A request just hit the server...")
});