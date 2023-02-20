import { Employee } from "./employee.js";

//variables Declaration
let email = document.querySelector("input[type='email']");
let firstName = document.getElementById("firstname");
let lastName = document.getElementById("lastname");
let address = document.getElementById("address");
let age = document.getElementById("age");
let signUp=document.getElementsByTagName("button")[0];
let login =document.getElementsByTagName("button")[1];
let emailArray = [];
let userNames = [];
 

//get Employees Data
(async function getData() {
    let allEmployeesJson = await fetch(`http://localhost:3000/employees`);
    let allEmployeesObjects = await allEmployeesJson.json();
    allEmployeesObjects.forEach(function (element) {
        emailArray.push(element.email);
        userNames.push(element.userName)
    })
})();

//get job value
function getJobValue(){
    let job=document.getElementsByName('job');
    for(let i=0;i<job.length;i++){
        if(job[i].checked)
        {
            return (job[i].value);   
        }
    }
}
//check regex
function check(element, regex) {
    if (element == email) {
        if (regex.test(element.value)) {
            for (let counter = 0; counter < emailArray.length; counter++) {
                if (email.value == emailArray[counter]) {
                    email.classList.add("not_valid");
                    email.classList.remove("valid");
                    return false
                }
            }
            email.classList.remove("not_valid");
            
            email.classList.add("valid");
            return true;
        } else return false;

    } else return regex.test(element.value);
}

//change style
function checkStyle(element, regex) {
    if (check(element, regex)) {
        element.classList.add("valid");
        element.classList.remove("not_valid");
    } else {
        element.classList.add("not_valid");
        element.classList.remove("valid");
    }
}

//Add New Employee to db.json
 async function sendData() {
    let userName=generateRandomUsername(firstName.value);
    let userPass=generateRandomPassword();
    let jobValue =getJobValue();
    let newemp = new Employee(
        email.value.trim(),
        firstName.value.trim(),
        lastName.value.trim(),
        address.value.trim(),
        age.value.trim(),
        userName,
        userPass,
        jobValue
    )
    await Swal.fire(
        'Congrats!',
        'Wait For Admin Confirmation',
        'success'
      )
    newemp.save(); 
}

//ReGisTer action
signUp.addEventListener('click', function (e) {
    e.preventDefault();
    checkStyle(email, /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    checkStyle(firstName, /^[a-zA-z]{3,15}$/);
    checkStyle(lastName, /^[a-zA-z]{3,10}$/);
    checkStyle(address, /^[a-zA-Z0-9\s,.'-]{3,40}$/);
    checkStyle(age, /(^1[8-9]$)|(^[2-3][0-9]$)|(^40$)/);

    if (!(check(email,  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) &&
        check(firstName, /^[a-zA-z]{3,15}$/) &&
        check(lastName, /^[a-zA-z]{3,10}$/) &&
        check(address, /^[a-zA-Z0-9\s,.'-]{3,}$/) &&
        age.value >= 18 && age.value <= 40)
    ) {
        e.preventDefault();
    }
    else {
        sendData()
    }
}
);

// go to LoGin page
login.addEventListener("click",function(){
    location.assign("http://127.0.0.1:5500/html_pages/login.html")
})

//generate random username
function generateRandomUsername(name) {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let usernameLength = 4;
    let username = name;
    for (let i = 0; i <= usernameLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        username += chars.substring(randomNumber, randomNumber + 1);
    }
    for (let i = 0; i < userNames.length; i++) {
        if (username == userNames[i]) {
            return username = generateRandomUsername(name);
        }
    }
    return username;
}

//generate random password
function generateRandomPassword() {
    let chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let passwordLength = 10;
    let password = "";
    for (let i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }

    return password;
}
