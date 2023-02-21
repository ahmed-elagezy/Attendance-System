//declarations
let userNames = [];
let code = document.querySelector("input[type='text']");
let invalid = document.getElementById("invalid")
let form = document.forms[0];
let startSystem=document.getElementsByClassName("startSystem")[0];
let profile=document.getElementsByClassName("profile")[0];
let logout=document.getElementsByClassName("logout")[0];

//check authentication
let employee = JSON.parse(sessionStorage.getItem("security"));
if (employee == null) {
    alert("UnAutorized,Please Login Again")
    location.assign(`http://127.0.0.1:5500/html_pages/login.html`)
}
let empName = employee.userName;


//get all employees data and push usernames into array
(async function getEmployeesData() {
    let allEmployees = await fetch(`http://localhost:3000/employees`);
    let allEmployeesObjects = await allEmployees.json();
    allEmployeesObjects.forEach(emp =>
        userNames.push(emp.userName)
    )   
})();


//check if its new day or the same day (for showing start day button)
(async function checkStartState(){
   let wDays= await fetch(`http://localhost:3000/workingDays`)
   let wDaysIbjects=await wDays.json();
   if(wDaysIbjects.length){
        if(wDaysIbjects[wDaysIbjects.length-1].id==formatDate(new Date())){
            $(".startSystem").hide();
            $("#confirm").show();
        }else{
            $(".startSystem").show();
            $("#confirm").hide();
        }
   }
})();

startSystem.addEventListener("click",newDay)

//starting new day --> make all employees absent until they come
async function newDay(){
    let emps=await fetch (`http://localhost:3000/attendance`);
    let empsObjects=await emps.json();
    for(let i=0;i<empsObjects.length;i++){
        empsObjects[i].absentDays.push(formatDate(new Date()));
        empsObjects[i].abs++;
    }
    for(let i=0;i<empsObjects.length;i++){
       await fetch(`http://localhost:3000/attendance/${empsObjects[i].id}`,
        {
            method:"PATCH",
            body:JSON.stringify({
                absentDays:empsObjects[i].absentDays,
                abs:empsObjects[i].abs
            }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
    }
    fetch(`http://localhost:3000/workingDays`,
        {
            method:"POST",
            body:JSON.stringify({id:formatDate(new Date())}),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })

}


 //check if emp attend or departure
  async function checkAttend(userName, currentDate) {
    let userData =await fetch(`http://localhost:3000/attendance?userName=${userName}`)
    let userDataObject = await userData.json();
    let lastDayOfArray = userDataObject[0].info[userDataObject[0].info.length - 1];
    let updatedInfo = userDataObject[0].info;
    if (lastDayOfArray.date == formatDate(currentDate)) {

            await Swal.fire(
                'Done!',
                'Departure Time Assigned Successfully',
                'success'
              )
              let execusesValue=userDataObject[0].execuses;
              //  alert(execusesValue);
              if(execuseHandle(currentDate)){
                execusesValue++;
                lastDayOfArray.execuseStatus = true;
            }
    
            
            lastDayOfArray.out = formatTime(currentDate)
            updatedInfo[updatedInfo.length - 1] = lastDayOfArray
            
            fetch(`http://localhost:3000/attendance/${userName}`, {
                method: "PATCH",
                body: JSON.stringify({
                    execuses:execusesValue,
                    info: updatedInfo,
                }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
        
    }else{
        await Swal.fire(
            'Done!',
            'Arrive Time Assigned Successfully',
            'success'
          )
        let attendValue = userDataObject[0].attend;
        attendValue++;

        let absentValue=userDataObject[0].abs;
        absentValue--;

        let absentDays=userDataObject[0].absentDays.slice(0,-1);


        let lateValue=userDataObject[0].late;

        let attendStatus =getAttendenceStatus(currentDate);
        if(attendStatus=="Late"){
            lateValue++;
        }
        let attendobject = { arrive: `${formatTime(currentDate)}`,
         date: `${formatDate(currentDate)}`
         ,arrivestatus:`${attendStatus}`,
         out:"4:00 pm",
         execuseStatus:false
        }
        
        if(lastDayOfArray.date !="")
        updatedInfo.push(attendobject)
        else 
        updatedInfo[userDataObject[0].info.length - 1]=attendobject
        
        fetch(`http://localhost:3000/attendance/${userName}`, {
            method: "PATCH",
            body: JSON.stringify({
                info: updatedInfo,
                attend:attendValue,
                abs:absentValue,
                absentDays:absentDays,
                late:lateValue
            }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })

    }
}

//check if username is in our database or not
function check(event) {
    event.preventDefault();
    let date = new Date();
    for (let i = 0; i < userNames.length; i++) {
        if (userNames[i] == code.value) {
            checkAttend(code.value, date)
            break;
        } else {
            Swal.fire(
                'Invalid UserName!',
                'Please Enter Valid UserName',
                'error'
              )
        }
    }
}


form.addEventListener("submit", check);

//logout and back to login page
logout.addEventListener("click", function () {
    location.replace("http://127.0.0.1:5500/html_pages/login.html")
    window.sessionStorage.removeItem("security")
    window.sessionStorage.removeItem("instructor")
})
//show employee's profile page
profile.addEventListener("click", function () {
    location.assign("http://127.0.0.1:5500/html_pages/emp.html")
})

//pecific formats
function formatDate(date) {
    return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
}
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//check if he leave early
function execuseHandle(date)
{
                                                          
    if(new Date("2022-09-20T16:00:00.000").getHours()-date.getHours()> 0)
        return true;
    else 
    return false;
}

///check if he arrive late or  on time
function getAttendenceStatus(date) {
    if (date.getHours() - new Date("2022-09-20T09:00:00.000").getHours() >= 0) {
      return "Late";
    } else if (
      date.getHours() - new Date("2022-09-20T09:00:00.000").getHours() ==0
    ) {
      if (
        date.getMinutes() - new Date("2022-09-20T09:00:00.000").getMinutes() >
        15
      ) {
        return "Late";
      }
    } else return "On Time";
  }