// Powered by Quotable
// https://github.com/lukePeavey/quotable

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const button = document.querySelector(".quotes__button");
    const quote = document.querySelector(".quotes-item__text");
    const cite = document.querySelector(".quotes-item__author");
  
    async function updateQuote() {
      // Fetch a random quote from the Quotable API
      const response = await fetch("https://api.quotable.io/quotes/random");
      const data = await response.json();
      if (response.ok) {
        console.log(data)
        quote.textContent = data[0].content;
        cite.textContent = data[0].author;
      } else {
        quote.textContent = "An error occured";
        console.log(data);
      }
    }
  
    // Attach an event listener to the `button`
    button.addEventListener("click", function() {
        button.style.rotate = '-360deg';
        setTimeout(() => {
            button.style.rotate = '0deg';
            updateQuote();
        }, 800);
    });
  
    // call updateQuote once when page loads
    updateQuote();
  });