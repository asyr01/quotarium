// Declaring variables from index.html
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const favBtn = document.getElementById('fav');
const main = document.getElementById('fav-quotes');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');


let data = []; // we'll putt all data to here

 function showLoadingSpinner() {
   loader.hidden = false;
   quoteContainer.hidden = true;
 }

 function removeLoadingSpinner() {
   if (!loader.hidden) {
     quoteContainer.hidden = false;
     loader.hidden = true;
   }
 }



// Get Quote From API
async function getQuote () {
showLoadingSpinner();
const proxyUrl = 'https://salty-harbor-31993.herokuapp.com/'
const apiUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";

 try {
   const response = await fetch(proxyUrl + apiUrl);
   const data = await response.json();
   const newQuote = {
     quote: data.quoteText,
     author: data.quoteAuthor,
   };
  
    addData(newQuote);


   // If Quote Author field is empty, so print Unknown.
   if(newQuote.author === '') {
     authorText.innerText = 'Unknown'
   } else {
     authorText.innerText = newQuote.author;
   }

  // Reduce font size for longer quotes than 120 characters.

  if(newQuote.quote > 120) {
    quoteText.classList.add('long-quote')
  } else {
    quoteText.classList.remove('long-quote')
  }
   
   favBtn.classList.remove('clicked');
   quoteText.innerText = newQuote.quote;

   removeLoadingSpinner();
      

 } catch (error) {
    getQuote(); 
 }

}

// For adding new quote to the data array.
function addData(obj){
  if(favBtn.classList.contains('clicked')){
    data.push(obj);
  }
}

// update DOM --forEach--
function updateDOM(providedData = data ) {
  // Clear main div
  main.innerHTML = `<h2><strong>Quote</strong>Author</h2>`;
  //take providedData
    providedData.forEach((item) => {
        const key = localStorage.key(item);
        const value = localStorage.getItem(key);
        const element = document.createElement('div');
        element.classList.add('fav__quote');
        element.innerHTML = `<strong>${key}</strong> <i>${value}<i>`;
        main.appendChild(element);
     });
  }

// For Tweeting Quotes
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} \n — ${author}`;
  window.open(twitterUrl, '_blank')
}


// Mark a quote as your favourite quote.
function favQuote() {
  favBtn.classList.toggle('clicked');
  key = quoteText.innerText;
  value = authorText.innerText;
 // if we have both key and value
    if(key && value){
       // and button is clicked
      if(favBtn.classList.contains('clicked')){
        localStorage.setItem(key, value);
        updateDOM();
        } else {
          localStorage.removeItem(key);
        }
      }
     } 


// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
favBtn.addEventListener('click', favQuote);

// On Load
getQuote();
