// Powered by weather api
// OpenWeather https://openweathermap.org/

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById('datalist');
    const langSelect = document.getElementById('lang');
    const meathureInputs = document.querySelectorAll('input[name="methure"]');
    const block = document.querySelector('.weather-settings__preview .wrapper');
    const form = document.querySelector('.weather__form');
    const datalistOptions = document.querySelector('.weather__form-data');
    let currentMeasure = 'metric';

    if (langSelect) {
      lang();
    }

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
      const currentLang = langSelect.value || 'en';
      const type = 'weather';
      meathureInputs.forEach(el => {
        console.log(el)
        if (el.checked) {
          currentMeasure = el.getAttribute('id');
        }
      });
      loadWeather(currentCity, currentLang, currentMeasure, type)
    }

    async function lang() {
      const requestURL = "lang.json";
      const request = new Request(requestURL);
      const response = await fetch(request);
      const langs = await response.json();
      const selectOptions = document.getElementById('lang');
      
      langs.forEach(({ name, id }) => {
        const option = document.createElement('option');
        option.setAttribute("value", id);
        option.textContent = name;
        selectOptions.append(option);
      });
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

    async function loadWeather(currentCity='Kyiv', currentLang='en', currentMeasure='metric', type='weather') {
      const api_url =`https://api.openweathermap.org/data/2.5/${type}?units=${currentMeasure}&q=${currentCity}&lang=${currentLang}&appid=5df46c6ea9222d2b4875c0dc6b4eb1c3`;
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