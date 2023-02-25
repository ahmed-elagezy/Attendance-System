//check admin authentication

let employee = JSON.parse(sessionStorage.getItem("admin"));
if (employee == null) {
    location.assign(`http://127.0.0.1:5500/html_pages/login.html`)
}

getAllEmployees();
getFullReport();
getLateReport();
getExecuseReport();
getPending();

//get all employees data
async function getAllEmployees(){
    let allEmpsData=await fetch(`http://localhost:3000/employees`);
    let allEmpsObjects= await allEmpsData.json();
    let allAttendData=await fetch(`http://localhost:3000/attendance`);
    let allAttendObjects=await allAttendData.json();
    $("#allEmpsRows").html("");
    for(let i=0;i<allEmpsObjects.length;i++){
        let row =document.createElement("tr");
        $(row).append("<td>" + allEmpsObjects[i].firstName + " " + allEmpsObjects[i].lastName + "</td>");
        $(row).append("<td>" + allEmpsObjects[i].address + "</td>");
        $(row).append("<td>" + allEmpsObjects[i].email + "</td>");
        $(row).append("<td>" + allEmpsObjects[i].age + "</td>");
        $(row).append("<td>" + allEmpsObjects[i].userName + "</td>");
        $(row).append("<td>" + allEmpsObjects[i].type + "</td>");
        $(row).append("<td>" + allAttendObjects[i].attend + "</td>");
        $(row).append("<td>" + allAttendObjects[i].abs + "</td>");
        $("#allEmpsRows").append(row)
    }
    $('#allEmps').DataTable(
        {
            "responsive": true, "lengthChange": false, "autoWidth": false
        })
}

//get pending request
async function getPending() {
    let allPendingData = await fetch(`http://localhost:3000/pending`);
    let allPendingObjects = await allPendingData.json();
    $("#requestsRows").html("");
    for (let i = 0; i < allPendingObjects.length; i++) {
        let row = document.createElement("tr");
        let confirm = document.createElement("td");
        confirm.innerHTML = `<i class='confirm fa-solid fa-circle-check fa-2x'style='color: green;'></i>`;
        confirm.children[0].addEventListener("click", function (e) {
            acceptRequest(e);
        })
        let reject = document.createElement("td");
        reject.innerHTML = `<i class='reject fa-solid fa-trash fa-2x'style='color: red; font-size: 1rem;'></i>`;
        reject.children[0].addEventListener("click",function (e) {
            deleteRequest(e);
        })
        $(row).append("<td>" + allPendingObjects[i].firstName + " " + allPendingObjects[i].lastName + "</td>");
        $(row).append("<td>" + allPendingObjects[i].address + "</td>");
        $(row).append("<td>" + allPendingObjects[i].email + "</td>");
        $(row).append("<td>" + allPendingObjects[i].age + "</td>");
        $(row).append("<td>" + allPendingObjects[i].userName + "</td>");
        $(row).append(confirm)
        $(row).append(reject)
        $("#requestsRows").append(row)
    }
    $('#requests').DataTable(
        {
            "responsive": true, "lengthChange": false, "autoWidth": false
        })
}
//Daily full report
async function getFullReport(){
    let currentDate=formatDate(new Date());
    let allAttendance=await fetch(`http://localhost:3000/attendance`)
    let allAttendanceObjects=await allAttendance.json();
    // console.log(allAttendanceObjects[0].info)
    for(let i=0;i<allAttendanceObjects.length;i++){
        let lastDay=allAttendanceObjects[i].info[allAttendanceObjects[i].info.length-1];
        if(lastDay.date==currentDate){

            let row = document.createElement("tr");
            $(row).append("<td>" + allAttendanceObjects[i].userName+"</td>");
            $(row).append("<td>" + lastDay.arrive+"</td>");
            $(row).append("<td>" + lastDay.out+"</td>");
            $("#fullreportRows").append(row)
        } 
    }
    $('#dailyReport').DataTable(
        {
            "responsive": true, "lengthChange": false, "autoWidth": false
        })
}
//Late Report
async function getLateReport(){
    let allLate=await fetch(`http://localhost:3000/attendance`);
    let allLateObjects=await allLate.json();
    for(let i=0;i<allLateObjects.length;i++){

            let row = document.createElement("tr");
            $(row).append("<td>" + allLateObjects[i].userName+"</td>");
            $(row).append("<td>" + allLateObjects[i].late+"</td>");
            $("#latereportRows").append(row)
        } 
    $('#lateReport').DataTable(
        {
            "responsive": true, "lengthChange": false, "autoWidth": false
        })
}

//Execuse Report
async function getExecuseReport(){
    let allExecuses=await fetch(`http://localhost:3000/attendance`);
    let allExecusesObjects=await allExecuses.json();
    for(let i=0;i<allExecusesObjects.length;i++){

            let row = document.createElement("tr");
            $(row).append("<td>" + allExecusesObjects[i].userName+"</td>");
            $(row).append("<td>" + allExecusesObjects[i].execuses+"</td>");
            $("#execuseReportRows").append(row)
        } 
    $('#execuseReport').DataTable(
        {
            "responsive": true, "lengthChange": false, "autoWidth": false
        })
}

//Search with specific Date
async function getSpecificReport(sDate){

    let allAttendance=await fetch(`http://localhost:3000/attendance`)
    let allAttendanceObjects=await allAttendance.json();
     $("#searchreportRows").html("");
    for(let i=0;i<allAttendanceObjects.length;i++){
        let info=allAttendanceObjects[i].info;

        for(let k=0;k<info.length;k++){
            if(info[k].date==sDate){

                let row = document.createElement("tr");
                $(row).append("<td>" + allAttendanceObjects[i].userName+"</td>");
                $(row).append("<td>" + info[k].arrive+"</td>");
                $(row).append("<td>" + info[k].out+"</td>");
                $("#searchreportRows").append(row)
                break;
            } 
        }
        
    }
    // $('#searchDate').DataTable(
    //     {
    //         "responsive": true, "lengthChange": false, "autoWidth": false
    //     })
}

// Declaration
let allEmployees = document.getElementById("monthly-tab");
let fullReport = document.getElementById("fullreport-tab");
let lateReport = document.getElementById("latereport-tab");
let execusereport = document.getElementById("execusereport-tab");
let pendingRequests = document.getElementById("requests-tab");
let searchDate = document.getElementById("searchDate-tab");
let pickDate = document.getElementsByName("range")[0];
let searchInput = document.getElementsByName("query")[0];
let searchButton = document.querySelector("button[type ='submit']");
let activeElements = document.getElementsByClassName("active");
let tabsContent = document.getElementsByClassName("tab-pane");
let logout = document.getElementsByClassName("logout")[0];

//show data picker
$(function() {
    $('input[name="date"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      minYear: 2023,
      maxYear: parseInt(moment().format('YYYY'),10),
      opens: 'left',
        locale: {
            format: 'D-M-Y'
        }
    })})

//search with specific data
    $('#searchform').submit((e) => {
        e.preventDefault();
        let date = $(".daterangepicker-field").val()
        getSpecificReport(date)
    })

allEmployees.addEventListener("click",function(){
    removeActive();
    this.classList.add("active")
    tabsContent[0].classList.add("active")
})

fullReport.addEventListener("click",function(){
    removeActive();
    this.classList.add("active");
    tabsContent[1].classList.add("active")
})

lateReport.addEventListener("click",function(){
    removeActive();
    this.classList.add("active");
    tabsContent[2].classList.add("active")
})

execusereport.addEventListener("click", function () {
    removeActive();
    this.classList.add("active")
    tabsContent[3].classList.add("active")
})

pendingRequests.addEventListener("click", function () {
    removeActive();
    this.classList.add("active")
    tabsContent[4].classList.add("active")
})

searchDate.addEventListener("click", function () {
    removeActive();
    this.classList.add("active")
    tabsContent[5].classList.add("active")
})

logout.addEventListener("click", function () {
    location.replace("http://127.0.0.1:5500/html_pages/login.html")
    window.sessionStorage.removeItem("admin");
})

//remove active to select another
function removeActive() {
    $(".tab-pane").each(function (index, element) {
        element.classList.remove("active")
    })
    $(".active").each(function (index, element) {
        element.classList.remove("active")
    })
}

//delete request from pending
async function deleteRequest(e) {
    let userName = e.target.parentElement.parentElement.children[4].innerText;
     let pendingData = await fetch(`http://localhost:3000/pending?userName=${userName}`);
     let pendingObject = await pendingData.json();
    await fetch(`http://localhost:3000/pending/${pendingObject[0].id}`, { method: "DELETE" })
}

//accept request from pending &put emp in employees and attendance
async function acceptRequest(e) {
    let userName = e.target.parentElement.parentElement.children[4].innerText;
    let pendingData = await fetch(`http://localhost:3000/pending?userName=${userName}`);
    let pendingObject = await pendingData.json();
    // console.log(pendingObject)
    let email = pendingObject[0].email;
    let userPass = pendingObject[0].password;
    let tempId=pendingObject[0].id;
    pendingObject[0].id="";
    let params = {
        from_name: "itielagezy",
        username: `${userName}`,
        password: `${userPass}`,
        to_mail: email,
    }
    
    emailjs.send('default_service', 'template_erp5kjg', params)
        .then(() => {

            fetch("http://localhost:3000/employees", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(pendingObject[0]),
            })
        }).then(()=>{
            // alert("saba7");
            fetch(`http://localhost:3000/pending/${tempId}`, { method: "DELETE" })
        }).then(()=>{           
            fetch(`http://localhost:3000/attendance`, {
                method: "POST",
                body: JSON.stringify({
                    id: pendingObject[0].userName,
                    userName: pendingObject[0].userName,
                    startDate: formatDate(new Date()),
                    attend: 0,
                    abs: 0,
                    late:0,
                    execuses:0,
                    absentDays:[],
                    info: [{ date: "" }]
                }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            }).then((data)=>{}).catch((err)=>alert(err));
        })
        }


        //specefic formats
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
        


