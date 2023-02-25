//check employee authentication

let employee = JSON.parse(sessionStorage.getItem("instructor"));
if (employee == null) {
    location.assign(`http://127.0.0.1:5500/html_pages/login.html`)
}
let empName = employee.userName;

//get today report
(async function getDailyReport() {
    let today = new Date();
    let userData = await fetch(`http://localhost:3000/attendance?userName=${empName}`);
    let userDataObject = await userData.json();
    let attendInfo = userDataObject[0].info;
    //console.log(userDataObject[0]);
    let lastDay = attendInfo[attendInfo.length - 1];
    //alert(lastDay.date == formatDate(today));
    if (lastDay.date == formatDate(today)) {
        $(".absent").hide();
        $("#dailyReport").show();
        let row = document.createElement("tr");
        $(row).append("<td>" + userDataObject[0].userName + "</td>")
        $(row).append("<td>" + lastDay.arrive + "</td>");
        $(row).append("<td>" + lastDay.out + "</td>");

        if (lastDay.execuseStatus)
            $(row).append("<td>" + lastDay.execuseStatus + "</td>");
        else $(row).append("<td>" + " " + "</td>");
        $(row).append("<td>" + lastDay.arrivestatus + "</td>");

        $("#dailyReportRows").append(row)

    } else {
        $(".absent").show();
        $("#dailyReportt").hide();
    }
})()

//get specific range report
async function getRange(start, end) {
    let userData = await fetch(`http://localhost:3000/attendance?userName=${empName}`);
    let userDataObject = await userData.json();
    $("#monthlyReportRows").html("");
    // console.log(userDataObject)
    let attenInfo = userDataObject[0].info
    // console.log(attenInfo);

    if (attenInfo.length) {
        let startIndex = getStartIndex(start, attenInfo)
        let endIndex = getEndIndex(end, attenInfo)
        // alert(startIndex);
        // alert(endIndex);
        for (let i = startIndex; i < endIndex; i++) {
            let row = document.createElement("tr");
            $(row).append("<td>" + attenInfo[i].date + "</td>")
            $(row).append("<td>" + attenInfo[i].arrive + "</td>")
            // if(attenInfo[i].out!=""){
                $(row).append("<td>" + attenInfo[i].out + "</td>")
                $(row).append("<td>" + attenInfo[i].execuseStatus + "</td>")
                
            $(row).append("<td>" + attenInfo[i].arrivestatus + "</td>")
            $("#monthlyReportRows").append(row);
        }

    }

}


//declarations
let rangeReport = document.getElementById("rangeReport-tab");
let dailyReport = document.getElementById("dailyReport-tab");
let tabsContent = document.getElementsByClassName("tab-pane");
let logout = document.getElementsByClassName("logout")[0];

//show date range picker
$(function () {
    $('input[name="range"]').daterangepicker({
        opens: 'left',
        locale: {
            format: 'D-M-Y'
        }
    });
}
);

//search with a specific range
$('#searchform').submit((e) => {
    e.preventDefault();
    let dateRange = $(".daterangepicker-field").val()
    let start = dateRange.split(" - ")[0].trim();
    let end = dateRange.split(" - ")[1].trim();
    getRange(start, end);
    // console.log(dateRange.split(" - ")[0].trim());

})


dailyReport.addEventListener("click", function () {
    removeActive();
    this.classList.add("active")
    tabsContent[0].classList.add("active")
})

rangeReport.addEventListener("click", function () {
    removeActive();
    this.classList.add("active")
    tabsContent[1].classList.add("active")
})

logout.addEventListener("click", function () {
    location.replace("http://127.0.0.1:5500/html_pages/login.html")
    window.sessionStorage.removeItem("instructor")
    window.sessionStorage.removeItem("security")
})

//get start date for range
function getStartIndex(date, arr) {

    for (let i = 0; i < arr.length; i++) {

        if (arr[i].date == date) {
            return i;
        }
    }
    return 0;
}

//get end date for range
function getEndIndex(date, arr) {

    for (let i = 0; i < arr.length; i++) {

        if (arr[i].date == date) {
            return i;
        }
    }
    return arr.length;
}

//remove active to select another
function removeActive() {
    $(".tab-pane").each(function (index, element) {
        element.classList.remove("active")
    })
    $(".active").each(function (index, element) {
        element.classList.remove("active")
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


