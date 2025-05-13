const todoContainer = document.querySelector(".todo-container");
const signInBtn = document.querySelector(".signin-container-inner .button button");
const todoList = todoContainer.querySelector(".todo-list .list-items");

async function signup() {

    const input = document.querySelectorAll(".signup-input-wrapper input");
    const username = input[0].value;
    const password = input[1].value;

    if(!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    const response = await axios.post("http://localhost:3000/sign-up", {
        username: username,
        password: password
    });

    input[0].value = "";
    input[1].value = "";
    
    if(response.data.msg == "Successfully signed up") {
        document.querySelector(".signup-container").style.display = "none";
        document.querySelector(".signin-container").style.display = "block";
    } else {
        alert("username already exists, go to the sign-in page.");
    }

}

async function getTodos() {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get('/me', {
            headers: {
                token: token
            }
        });
        const arr = response.data.todos;
        if(arr && arr.length > 0) {
                    arr.forEach(element => {
                    const li = document.createElement("li");
                    li.className = "list-item";
                    li.id = element.id;
                    const input = document.createElement("input");
                    input.setAttribute("type", "checkbox");
                    const p = document.createElement("p");
                    p.textContent = element.task;
                    const span1 = document.createElement("span");
                    const span2 = document.createElement("span");
                    span1.className = "material-symbols-rounded";
                    span1.textContent = "edit";
                    span2.className = "material-symbols-rounded";
                    span2.textContent = "delete_forever";
                    const children = [input, p, span1, span2];
                    children.forEach(child => li.appendChild(child));
                    todoList.appendChild(li);
                    console.log(li);
                });
        }
    } catch(error) {
        console.error("Error fetching todos: ",error);
    }
}

signInBtn.addEventListener('click', async function() {
    const input = document.querySelectorAll(".signin-input-wrapper input");
    const username = input[0].value;
    const password = input[1].value;

    if(!username || !password) {
        alert("Please enter both username and password");
        return;
    }
    
    try {
        const response = await axios.post("http://localhost:3000/sign-in", {
            username: username,
            password: password
        });   

        if(response.data.token) {
            //store the token
            localStorage.setItem("token", response.data.token);
            
            //switch from signin to todo-container.
            document.querySelector(".signin-container").style.display = "none";
            document.querySelector(".todo-container").style.display = "block";

            await getTodos();
        }
    } catch(error) {
        console.error("Sign in failed: ", error);
    }
})

function signupToSignin() {

        document.querySelector(".signup-container").style.display = "none";
        document.querySelector(".signin-container").style.display = "block";
}

function signinToSignup(){

        document.querySelector(".signin-container").style.display = "none";
        document.querySelector(".signup-container").style.display = "block";
}

document.querySelector(".todo-add button").addEventListener('click', async() => {
    const todo = document.querySelector(".todo-add input").value;
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post('/add-todo', {
                task: todo
            },{
                headers: {
                    token: token
                }
            });
            // Gotta clear the element and not the input take above i.e. todo.
            document.querySelector(".todo-add input").value = "";

            //Render the new added todo
            await getTodos();

        } catch(error) {
            console.error("Error fetching data: ", error);
        }
})

