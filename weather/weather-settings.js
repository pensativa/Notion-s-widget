// Powered by weather api
// OpenWeather https://openweathermap.org/

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById('datalist');
    const langSelect = document.getElementById('lang');

    if (langSelect) {
      lang();
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

});