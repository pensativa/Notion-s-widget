function getRandomWish() {
    const wishes = [
        "<i>“ You're doing great! Keep it up!</i> 😊",
        "<i>“ Cleaning can be fun—put on your favorite music!</i> 🎶",
        "<i>“ A tidy space brings a tidy mind. Keep going!</i> ✨",
        "<i>“ Small steps make a big difference!</i> 🚀",
        "<i>“ You're one step closer to a spotless home!</i> 🏡",
        "<i>“ Take a deep breath—you've got this!</i> 🌿",
        "<i>“ Cleaning done? Time for a well-deserved break!</i> ☕",
        "<i>“ Every little effort counts. Keep shining!</i> 🌟",
        "<i>“ A fresh start begins with a clean space!</i> 🌼",
        "<i>“ Your future self will thank you!</i> 💪",
        "<i>“ One task at a time—you're making progress!</i> 💪",
        "<i>“ A clean home is a happy home. Keep going!</i> 🏡✨",
        "<i>“ You're turning chaos into calm—great job!</i> 🌿",
        "<i>“ Just 10 minutes of cleaning can make a huge difference!</i> ⏳",
        "<i>“ Tidy space, tidy mind—you're on the right track!</i> 🧹",
        "<i>“ You’re creating a peaceful and cozy home!</i> ☕🏡",
        "<i>“ A little effort today saves a big mess tomorrow!</i> 🔄",
        "<i>“ Cleaning is self-care too—you're doing amazing!</i> 💖",
        "<i>“ Turn up the music and make cleaning fun!</i> 🎶",
        "<i>“ Small steps, big results—you're nailing it!</i> 🚀",
        "<i>“ Imagine how great your space will feel after this!</i> ✨",
        "<i>“ A little progress each day adds up to big changes!</i> 📆",
        "<i>“ Your home is thanking you for the love!</i> 🏠💕",
        "<i>“ Decluttering = Less stress. Keep going!</i> 🌿",
        "<i>“ You're making your space shine—keep it up!</i> 🌟",
        "<i>“ Think of the fresh start you’re creating!</i> 🌼",
        "<i>“ One task down, many victories to go!</i> ✅",
        "<i>“ The best reward? A clean and cozy space!</i> 🎉",
        "<i>“ You're a home organization wizard!</i> 🧙‍♂️",
        "<i>“ Future you will be so proud—keep up the great work!</i> 💪"
    ];
    return wishes[Math.floor(Math.random() * wishes.length)];
}

function updateMessage() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString(undefined);
    const wish = getRandomWish();

    document.getElementById("taskMessage").innerHTML = 
        `<p>Phrase of the day:</p> 
        <p>${wish}</p>`;
}

updateMessage();

// Powered by weather api
// OpenWeather https://openweathermap.org/

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById('datalist');
    const meathureInputs = document.querySelectorAll('input[name="methure"]');
    const block = document.querySelector('.weather-settings__preview .wrapper');
    const form = document.querySelector('.weather__form');
    const datalistOptions = document.querySelector('.weather__form-data');
    let currentMeasure = 'metric';

    async function populate(searchName) {
      const requestURL = "city.list.min.json";
      const request = new Request(requestURL);
      const response = await fetch(request);
      const citys = await response.json();
      datalistOptions.innerHTML = '';

      let result = [];
      searchName = searchName.toLowerCase();
      if (searchName.length > 1) {
        citys.find(({ name }) => {
          if (name.toLowerCase().includes(searchName)) {
            result.push(name)
          }
        });
        if (result.length > 0) {
          chooseResultOption();
          result.forEach(el => {
            const p = document.createElement('p');
            p.innerHTML = el;
            datalistOptions.append(p);
          });
        } else {
          datalistOptions.innerHTML = '<p class="not-found">No matches found</p>'
          return false;
        }
      }
    }

    function chooseResultOption() {
      let myInterval = 500;
      setInterval(() => { 
        let options = document.querySelectorAll('.weather__form-data p');
        options.forEach(option => {
          option.onclick = () => {
            cityInput.value = option.textContent;
            datalistOptions.innerHTML = ''
          }
        })
      }, myInterval);
    }

    form.onsubmit = (e) => {
      e.preventDefault();
      const currentCity = cityInput.value || 'Kyiv';
      const type = 'weather';
      meathureInputs.forEach(el => {
        console.log(el)
        if (el.checked) {
          currentMeasure = el.getAttribute('id');
        }
      });
      loadWeather(currentCity, currentMeasure, type)
    }

    if (cityInput) {
      cityInput.oninput = (e) => {
        populate(e.target.value);
      }
    }

    function isPlus(temp) {
      let currentTemp = Math.round(temp);
      let meathureSign = '°C'
      if (currentMeasure == 'imperial') {
        meathureSign = 'K'
      } else if (currentMeasure == 'standard') {
        meathureSign = '°F'
      }
      if (currentTemp < 0) {
        return `<span class="minus">${currentTemp}</span> ${meathureSign}`
      }
      return `<span class="plus">${currentTemp}</span> ${meathureSign}`
    }

    async function loadWeather(currentCity='Kyiv', currentMeasure='metric', type='weather') {
      const api_url =`https://api.openweathermap.org/data/2.5/${type}?units=${currentMeasure}&q=${currentCity}&lang=en&appid=5df46c6ea9222d2b4875c0dc6b4eb1c3`;
      console.log(api_url)

      block.innerHTML = `
        <div class="weather__loading">
          <div class="weather__loading-spinner"></div>
        </div>
        `
  
      try {
        const response = await fetch(api_url);
        const data = await response.json();
        if (!response.ok) throw new Error(`${statusCode} ${statusMessage}`);
        console.log(data)
        getWeather(data)
      } catch (error) {
        console.error(error);
        block.innerHTML = statusMessage;
      }
    }

    loadWeather();

    function getWeather(data) {
      //console.log(data)
      const city = data.name;
      const status = data.weather[0].description;
      const temp = isPlus(data.main.temp);
      const feelsLike = isPlus(data.main.feels_like);
      const icon = data.weather[0].icon.replace(/[^-0-9-.]/, '');
      const teplate = `
            <div class="weather__header">
              <div class="weather__main">
                  <div class="weather__city">${city}</div>
                  <div class="weather__status">${status}</div>
              </div>
              <div class="weather__icon">
                  <div class="weather__temp">${temp}</div>
                  <img src="img/${icon}.svg" alt="${status}" width="50" height="50">
              </div>
            </div>
            <div class="weather__feels-like">Feels like: ${feelsLike}</div>`
      block.innerHTML = teplate
    }

});

function settingPanel() {
    document.querySelector('.weather-settings__bar').classList.toggle('show');
}