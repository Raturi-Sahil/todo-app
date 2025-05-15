const todoContainer = document.querySelector(".todo-container");
const signInBtn = document.querySelector(".signin-container-inner .button button");
const todoList = todoContainer.querySelector(".todo-list .list-items");
const addTodoBtn = document.querySelector(".todo-add button");
const inputTodo = document.querySelector(".todo-add input");
let isEditing = false;


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

function taskCompleted(e) {
    console.log("checkbox clicked");
    const checkbox = e.target;
    const p = checkbox.nextElementSibling;
    p.classList.toggle("strikethrough", checkbox.checked);
}

function editTodo(e) {
    if(isEditing) return; 
    isEditing = true;

    const parent = e.target.parentElement;
    
    if(parent.querySelectorAll("input")[1]) return;
    console.log(parent);

    const p = parent.querySelector(".todo-content");
    

    if(p) {

    const input = document.createElement("input");
    input.type = "text";
    input.value = p.textContent;
    input.className = p.className;

    //replace p with input. 
    parent.replaceChild(input, p);
    input.focus();

    

    input.addEventListener("keydown", function(e) {
        if(e.key == "Enter") {
            updateHandler(input.value);
        }   
    });

    input.addEventListener("blur", function(e) {
            updateHandler(input.value);
    })
    // using this to prevent both events firing at once, cuz perssing may lead to lose of focus from the input too, cuz both events
    // to fire at once.
    let hasUpdated = false;

    async function updateHandler(value) {
            if(hasUpdated) return;
            hasUpdated = true;

            const newP = document.createElement("p");
            newP.textContent = value;
            newP.className = input.className;
            parent.replaceChild(newP, input);
            isEditing = false;

            if(value.trim()) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.post('/update-todo', {
                        task: newP.textContent,
                        id: parent.id
                    },{
                        headers: {
                            token: token
                        }
                    });
                } catch(error) {
                    console.error("Error: ", error);
                }
            }
    }

    }
}


async function deleteTodo(e) {
    console.log("inside the delete todo function in app.js");
    const parent = e.target.parentElement;

    await axios.post('/delete-todo', {
        id: parent.id
    }, {
        headers: {
            token: localStorage.getItem("token")
        }
    });

    todoList.removeChild(parent);
}


// This function renders the todos. 
async function renderTodos() {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get('/me', {
            headers: {
                token: token
            }
        });

        todoList.innerHTML = ""; // Clear old list

        const arr = response.data.todos;
        if(arr && arr.length > 0) {
                    arr.forEach(element => {
                    const li = document.createElement("li");
                    li.className = "list-item";
                    li.id = element.id;
                    const input = document.createElement("input");
                    input.setAttribute("type", "checkbox");
                    //for evenlisteners we just pass the function as a reference.
                    input.addEventListener('change', taskCompleted);
                    const p = document.createElement("p");
                    p.textContent = element.task;
                    p.classList.add("todo-content");
                    const span1 = document.createElement("span");
                    const span2 = document.createElement("span");
                    span1.className = "material-symbols-rounded";
                    span1.textContent = "edit";
                    span1.addEventListener('click', editTodo);
                    span2.className = "material-symbols-rounded";
                    span2.textContent = "delete_forever";
                    span2.addEventListener('click', deleteTodo);
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

            await renderTodos();
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


// Add the todo to list-items.
async function addTodo() {

    const todo = inputTodo.value.trim();

    if(!todo) return;

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

            //Render the new added todo along with the already existing ones. 
            await renderTodos();

        } catch(error) {
            console.error("Error fetching data: ", error);
        }

}

addTodoBtn.addEventListener("click", addTodo);

inputTodo.addEventListener("keydown", function(e) {
    if(e.key === "Enter")
        addTodo();
});




