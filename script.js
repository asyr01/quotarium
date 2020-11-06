// Declaring variables from index.html
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Show Loading
 function loading() {
   loader.hidden = false;
   quoteContainer.hidden = true;
 }

 // Hide Loading
 function complete() {
   if (!loader.hidden) {
     quoteContainer.hidden = false;
     loader.hidden = true;
   }
 }

// Get Quote From API
async function getQuote () {
loading();
const proxyUrl = 'https://salty-harbor-31993.herokuapp.com/'
const apiUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";

 try {
   const response = await fetch(proxyUrl + apiUrl);
   const data = await response.json();
   // If Quote Author field is empty, so print Unknown.
   if(data.quoteAuthor === '') {
     authorText.innerText = 'Unknown'
   } else {
     authorText.innerText = data.quoteAuthor;
   }

  // Reduce font size for longer quotes than 120 characters.

  if(data.quoteText.length > 120) {
    quoteText.classList.add('long-quote')
  } else {
    quoteText.classList.remove('long-quote')
  }

   quoteText.innerText = data.quoteText;

   // Stop Loader and show the quote.
   complete();

 } catch (error) {
     getQuote(); 
 }
}

// For Tweeting Quotes
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} \n — ${author}`;
  window.open(twitterUrl, '_blank')
}


// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);


// On Load
getQuote();
