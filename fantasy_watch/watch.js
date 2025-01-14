function showRealTime(date) {
    const currentDay = document.querySelector('.day');
    const currentMonth = document.querySelector('.month');
    const currentHour = document.querySelector('.hour');
    const currentMinute = document.querySelector('.minute');
    const root = document.documentElement;

    let hourdeg = ((date.hour % 12) * 3600 + date.minute * 60 + date.second)/43200*360;
    let minutedeg = (date.minute * 60 + date.second)/3600*360;
    
    root.style.setProperty('--hour-deg', `${hourdeg}deg`);
    root.style.setProperty('--minut-deg', `${minutedeg}deg`);

    if (date.day < 10) {
        currentDay.innerHTML = `0${date.day}`;
    } else {
        currentDay.innerHTML = date.day;
    }

    currentMonth.innerHTML = date.month;

    if (date.hour < 10) {
        currentHour.innerHTML = `0${date.hour}`;
    } else {
        currentHour.innerHTML = date.hour;
    }

    if (date.minute < 10) {
        currentMinute.innerHTML = `0${date.minute}`;
    } else {
        currentMinute.innerHTML = date.minute;
    }
}

let today = new Date();
let myInterval = 59000 - (today.getSeconds() * 1000);

let currentDate = {
    day: today.getDate(),
    month: monthName(today.getMonth()),
    hour: today.getHours(),
    minute: today.getMinutes(),
    second:today. getSeconds()
}
showRealTime(currentDate);

setInterval(() => {
    today = new Date();

    //Get day
    currentDate.day = today.getDate();

    //Get month
    currentDate.month = monthName(today.getMonth());

    //Get hour
    currentDate.hour = today.getHours();
    
    //Get minutes
    currentDate.minute = today.getMinutes();

    currentDate.second = today.getSeconds();
    showRealTime(currentDate)
}, myInterval);

//Get month
function monthName(month) {
    let name;
    switch (month) {
        case 1:
            name = 'February'
            break;
        case 2:
            name = 'March'
            break;
        case 3:
            name = 'April'
            break;
        case 4:
            name = 'May'
            break;
        case 5:
            name = 'June'
            break;
        case 6:
            name = 'July'
            break;
        case 7:
            name = 'August'
            break;
        case 8:
            name = 'September'
            break;
        case 9:
            name = 'October'
            break;
        case 10:
            name = 'November'
            break;
        case 11:
            name = 'December'
            break;
        default:
            name = 'January'
            break;
    }
    return name;
}
