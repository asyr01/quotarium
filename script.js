// Declaring variables from index.html
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const favBtn = document.getElementById('fav');
const favQuoteNav = document.getElementById('favquote');
const favAuthNav = document.getElementById('favauthor');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

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

// Mark a quote as your favourite quote.

// Get Quote From API
async function getQuote () {
showLoadingSpinner();
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
   
   favBtn.classList.remove('clicked');
   quoteText.innerText = data.quoteText;

   removeLoadingSpinner();
      

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



function favQuote() {
  favBtn.classList.toggle('clicked');
  const key = quoteText.innerText;
  const value = authorText.innerText;

 // if we have both key and value
    if(key && value){
       // and button is clicked
      if(favBtn.classList.contains('clicked')){
          localStorage.setItem(key,value);

          for(let i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            favQuoteNav.innerHTML += `${key} : ${value}<br /> <br />`;
            
        }
      } else {
        localStorage.removeItem(key);
        favQuoteNav.innerText = '';
        favAuthNav.innerText = '';
      }
    }
}


// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
favBtn.addEventListener('click', favQuote)

// On Load
getQuote();
