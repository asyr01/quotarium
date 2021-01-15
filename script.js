// Declaring variables from index.html
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const backBtn = document.getElementById('back');
const twitterBtn = document.getElementById('twitter');
const favBtn = document.getElementById('fav');
const newQuoteBtn = document.getElementById('new-quote');
const deleteFavs = document.getElementById('fav__clear');
const fav = document.getElementById('fav-quotes');
const loader = document.getElementById('loader');

// we will keep previous quote in array and values inside the assigned variables.
let data = [];
let prevQuote = '';
let prevAuthor = '';

updateDOM() 

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
    author: data.quoteAuthor
   }

   addData(newQuote);

   // If Quote Author field is empty, so print Unknown.
   if(data.authorText === '') {
     authorText.innerText = 'Unknown'
   } else {
     authorText.innerText = data.quoteAuthor;
   }

  // Reduce font size for longer quotes than 120 characters.

  if(data.quoteText.length > 100) {
    quoteText.classList.add('long-quote')
  } else {
    quoteText.classList.remove('long-quote')
  }
  
   favBtn.classList.remove('clicked');  
   backBtn.classList.remove('disabled');
   
   quoteText.innerText = data.quoteText;
   removeLoadingSpinner();

 } catch (error) {
    getQuote(); 
 }
}

// adding data to array
function addData(obj) {
  data.push(obj);
  if (data.length > 2) {
      data.shift();
    }
    prevQuote = data[0].quote;
    prevAuthor = data[0].author;
 } 


// update hamburger's DOM 
function updateDOM() {
  // Check if local storage is empty
    if(localStorage.length < 1){
      deleteFavs.style.display = "none";
     }else {
      deleteFavs.style.display = "block";
     }
    // Clear fav div
    fav.innerHTML = `<h2><strong>Quote</strong>Author</h2>`;

    for(let i = 0; i < localStorage.length; i++) {
      const element = document.createElement('div');
      element.classList.add('fav__quote');
      element.innerHTML = `<strong>${localStorage.key(i)}</strong> <i class="cool-text">${localStorage.getItem(localStorage.key(i))}<i>`;
      fav.appendChild(element); 
    }
  }

// For Tweeting Quotes
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} \n — ${author}`;
  window.open(twitterUrl, '_blank')
}

// Clear favourite quotes in the fav section.
function deleteFavourites()  {
  localStorage.clear();
  updateDOM();
}

// Mark a quote as your favourite quote.
function favQuote() {
  favBtn.classList.toggle('clicked');
  let key = quoteText.innerText;
  let value = authorText.innerText;
 // if we have both key and value
    if(key && value){
       // and button is clicked
      if(favBtn.classList.contains('clicked')){
        localStorage.setItem(key, value);
        updateDOM();
        } else {
          localStorage.removeItem(key);
          updateDOM();
        }
      }
     } 

  // For calling previous quote
  function callPrevQuote() {
     if(data.length >= 1){
       backBtn.classList.add('disabled');
       quoteText.innerText = prevQuote;
       authorText.innerText = prevAuthor;
      
     } else{
      backBtn.classList.remove('disabled');
     }
  }

  callPrevQuote();


// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
favBtn.addEventListener('click', favQuote);
deleteFavs.addEventListener('click', deleteFavourites);
backBtn.addEventListener('click', callPrevQuote);

// On Load
getQuote();
