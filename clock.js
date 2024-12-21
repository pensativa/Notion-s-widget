function showRealTime(date) {
    const currentDay = document.querySelector('.day');
    const currentMonth = document.querySelector('.month');
    const currentWeekday = document.querySelector('.weekday');
    const currentHour = document.querySelector('.hour');
    const currentMinute = document.querySelector('.minute');
    const currentSecond = document.querySelector('.second');

    if (date.day < 10) {
        currentDay.innerHTML = `0${date.day}`;
    } else {
        currentDay.innerHTML = date.day;
    }

    currentMonth.innerHTML = date.month;
    currentWeekday.innerHTML = date.weekday;

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
    
    if (date.second < 10) {
        currentSecond.innerHTML = `0${date.second}`;
    } else {
        currentSecond.innerHTML = date.second;
    }
}

let today = new Date();
let options = { weekday: "long" };

let currentDate = {
    day: today.getDate(),
    month: monthName(today.getMonth()),
    weekday: new Intl.DateTimeFormat("en-US", options).format(today),
    hour: today.getHours(),
    minute: today.getMinutes(),
    second: today.getSeconds()
}

showRealTime(currentDate);

//Get day and weekday
setInterval(() => {
    today = new Date();
    currentDate.weekday = new Intl.DateTimeFormat("en-US", options).format(today);
    currentDate.day = today.day;
    currentDate.month = today.getMonth();
    showRealTime(currentDate)
}, 1440000);

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
setInterval(() => {
    currentDate.month = monthName(today.getMonth());
    showRealTime(currentDate)
}, 1440000);

//Get hour
setInterval(() => {
    today = new Date();
    currentDate.hour = today.getHours();
    showRealTime(currentDate)
}, 60000);

//Get minutes
setInterval(() => {
    today = new Date();
    currentDate.minute = today.getMinutes();
    showRealTime(currentDate)
}, 60000);

//Get second
setInterval(() => {
    today = new Date();
    currentDate.second = today.getSeconds();
    showRealTime(currentDate)
}, 1000);


