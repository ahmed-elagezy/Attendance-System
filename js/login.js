//declarations
let userName=document.querySelector("input[type='text']");
let password=document.querySelector("input[type='password']");
let login= document.getElementsByTagName("button")[0]

//check username and password
async function checkEmp(username,pass){

    let empData=await fetch(`http://localhost:3000/employees?userName=${username}&password=${pass}`);
    let empObject=await empData.json();
    if(username=="AElagezy0" && pass=="ahmed12345")
      {
        location.assign("http://127.0.0.1:5500/html_pages/admin.html");
        sessionStorage.setItem("admin", JSON.stringify({userName:username}));
      }  
    else if(empObject.length){
        if(empObject[0].type=="security"){
            sessionStorage.setItem("security", JSON.stringify({userName:username}));
            sessionStorage.setItem("instructor", JSON.stringify({userName:username}));
            location.assign("http://127.0.0.1:5500/html_pages/attendance.html");
        }else if(empObject[0].type=="instructor"){
            sessionStorage.setItem("instructor", JSON.stringify({userName:username}));
            location.assign("http://127.0.0.1:5500/html_pages/emp.html");
        }
       
    }else{
        Swal.fire(
            "You have entered an invalid username or password",
            "if you don't have an account you can create one now",
            'error'
          )
    }

    return empObject;
}

login.addEventListener("click",function(e){
    checkEmp(userName.value,password.value)
})
