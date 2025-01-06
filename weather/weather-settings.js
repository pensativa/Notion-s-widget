// Powered by weather api
// wttr.in https://wttr.in/ https://github.com/chubin/wttr.in

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById('datalist');
    const langSelect = document.getElementById('lang');
    const methureRadios = document.querySelectorAll('input[name="methure"]')
    const block = document.querySelector('.weather-settings__preview .wrapper');
    const getResultBtn = document.querySelector('.weather__form');
    const datalistOptions = document.querySelector('.weather__form-data');
    let mode = 'avgtempC';
    
    if (langSelect) {
      lang();      
      loadWeather();
    }

    getResultBtn.onsubmit = (e) => {
      e.preventDefault();
      const currentLang = langSelect.value || 'en';
      const currentCity = cityInput.value || 'Kyiv';
      methureRadios.forEach(el => {
        if (el.checked && el.getAttribute('id') == 'celsius') {
          mode = 'avgtempC'
        } else if (el.checked && el.getAttribute('id') == 'fahrenheit') {
          mode = 'avgtempF'
        }
      });
      loadWeather(currentCity, mode, currentLang)
    }

    function chooseResultOption() {
      let myInterval = 500;
      setInterval(() => { 
        let options = document.querySelectorAll('.weather__form-data p');
        options.forEach(option => {
          option.onclick = () => {
            cityInput.value = option.textContent;
            datalistOptions.innerHTML = '';
          }
        })
      }, myInterval);
    }

    async function populate(searchName) {
      const requestURL = "city.list.json";
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
      let methure = '°C'
      if (mode !== 'avgtempC') {
        methure = 'F'
      }

      if (currentTemp < 0) {
        return `<span class="minus">${currentTemp}</span> ${methure}`
      }
      return `<span class="plus">${currentTemp}</span> ${methure}`
    }

    async function loadWeather(currentCity = 'Kyiv', units = 'avgtempC', currentLang = 'en') {
      const api_url =`https://wttr.in/${currentCity}?format=j1&lang=${currentLang}`;

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

    function getWeather(data) {
      let temp = isPlus(data.weather[0].avgtempC);
      let feelsLike = isPlus(data.current_condition[0].FeelsLikeC);
      if (mode !== 'avgtempC') {
        temp = isPlus(data.weather[0].avgtempF);
        feelsLike = isPlus(data.current_condition[0].FeelsLikeF);
      }
      const city = data.nearest_area[0].areaName[0].value;
      const status = data.current_condition[0].weatherDesc[0].value;
      const icon = data.current_condition[0].weatherCode.replace(/[^-0-9-.]/, '');
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