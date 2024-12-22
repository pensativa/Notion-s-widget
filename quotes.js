// Powered by Quotable
// https://github.com/lukePeavey/quotable

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const button = document.querySelector(".quotes__button");
    const quote = document.querySelector(".quotes-item__text");
    const cite = document.querySelector(".quotes-item__author");

    async function updateQuote() {
      try {
        const response = await fetch("https://api.quotable.io/quotes/random");
        const { statusCode, statusMessage, ...data } = await response.json();
        if (!response.ok) throw new Error(`${statusCode} ${statusMessage}`);
        quote.textContent = data[0].content;
        cite.textContent = data[0].author;
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
            updateQuote();
        }, 800);
    });
  
    // call updateQuote once when page loads
    updateQuote();
  });