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
async function signin() {

    const input = document.querySelectorAll(".signin-input-wrapper input");
    const username = input[0].value;
    const password = input[1].value;
    console.log(username);
    console.log(password);
    



    const response = await axios.post("http://localhost:3000/sign-in", {
        username: username,
        password: password
    });

    console.log(response.data);

    input[0].value = "";
    input[1].value = "";

    if(response.data.msg === "Successfully signed in") {
        localStorage.setItem("token", response.data.token);
        document.querySelector(".signin-container").style.display = "none";
        document.querySelector(".todo-container").style.display = "block";
    } else {
        alert("Invalid username or password");
    }
    

}

function signupToSignin() {

        document.querySelector(".signup-container").style.display = "none";
        document.querySelector(".signin-container").style.display = "block";
}

function signinToSignup(){

        document.querySelector(".signin-container").style.display = "none";
        document.querySelector(".signup-container").style.display = "block";
}