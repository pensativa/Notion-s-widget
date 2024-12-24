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

setInterval(() => {
    today = new Date();

    //Get day and weekday
    currentDate.weekday = new Intl.DateTimeFormat("en-US", options).format(today);
    currentDate.day = today.getDate();

    //Get month
    currentDate.month = monthName(today.getMonth());

    //Get hour
    currentDate.hour = today.getHours();
    
    //Get minutes
    currentDate.minute = today.getMinutes();

    //Get second
    currentDate.second = today.getSeconds();
    showRealTime(currentDate)
}, 1000);

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