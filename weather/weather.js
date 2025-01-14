// Powered by weather api
// OpenWeather https://openweathermap.org/

document.addEventListener("DOMContentLoaded", () => {
    const block = document.querySelector(".weather");
    let isCity = localStorage.getItem('isCity');
    const cityInput = document.getElementById('datalist');
    if (isCity) {
      loadWeather(isCity)
    }

    async function populate(searchName) {
      const requestURL = "city.list.json";
      const request = new Request(requestURL);
      const response = await fetch(request);
      const citys = await response.json();
      const datalistOptions = document.querySelector('.weather__form-data');
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

    if (cityInput) {
      cityInput.oninput = (e) => {
        populate(e.target.value);
      }
    }
      

    function chooseResultOption() {
      let myInterval = 500;
      setInterval(() => { 
        let options = document.querySelectorAll('.weather__form-data p');
        options.forEach(option => {
          option.onclick = () => {
            loadWeather(option.textContent);
            localStorage.setItem("isCity", option.textContent);
          }
        })
      }, myInterval);
    }

    function isPlus(temp) {
      let currentTemp = Math.round(temp);
      if (currentTemp < 0) {
        return `<span class="minus">${currentTemp}</span>° C`
      }
      return `<span class="plus">${currentTemp}</span>° C`
    }

    async function loadWeather(currentCity) {
      const api_url =`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${currentCity}&appid=5df46c6ea9222d2b4875c0dc6b4eb1c3`;

      block.innerHTML = `
        <div class="weather__loading">
          <div class="weather__loading-spinner"></div>
        </div>
        `
  
      try {
        const response = await fetch(api_url);
        const data = await response.json();
        if (!response.ok) throw new Error(`${statusCode} ${statusMessage}`);
        //console.log(data)
        getWeather(data)
      } catch (error) {
        console.error(error);
        block.innerHTML = statusMessage;
      }
    }

    function getWeather(data) {
      //console.log(data)
      const city = data.city.name;
      const status = data.list[0].weather[0].main;
      const temp = isPlus(data.list[0].main.temp);
      const feelsLike = isPlus(data.list[0].main.feels_like);
      const icon = data.list[0].weather[0].icon.replace(/[^-0-9-.]/, '');
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