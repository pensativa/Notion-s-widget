// Powered by Quotes api
// https://github.com/well300/quotes-api

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const button = document.querySelector(".quotes__button");
    const quote = document.querySelector(".quotes-item__text");
    const cite = document.querySelector(".quotes-item__author");
    const api_url ="https://quotes-api-self.vercel.app/quote";

    async function updateQuote(url) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(`${statusCode} ${statusMessage}`);
        quote.textContent = data.quote;
        cite.textContent = data.author;
      } catch (error) {
        console.error(error);
        quote.textContent = "Opps... Something went wrong";
      }
    }
  
    // Attach an event listener to the `button`
    button.addEventListener("click", function() {
        button.style.rotate = '-360deg';
        setTimeout(() => {
            button.style.rotate = '0deg';
            updateQuote(api_url);
        }, 800);
    });
  
    // call updateQuote once when page loads
    updateQuote(api_url);
  });