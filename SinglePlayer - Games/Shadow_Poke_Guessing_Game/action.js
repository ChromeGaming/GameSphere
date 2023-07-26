//for implementation details visit marinsborg.com
var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?'; //API base URL
var offset = 0; 
var limit = 665; //limiting Pokemons - sprites are not numbered properly after 665
var pokemonUrl = apiUrl + 'limit=' + limit + '&offset=' + offset; //complete URL with limit
var spriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'; //base URL from which sprites are fetched
const spriteElement = document.getElementById("sprite"); //element object from HTML with an id 'sprite'
const guess = document.getElementById("guess"); //element object from HTML with an id 'guess'
const streakElement = document.getElementById("streak"); //element object from HTML with an id 'streak'
const pokemonNameElement = document.getElementById("pokemon-name"); //element object from HTML with an id 'pokemon-name'
var streak = 0; //initialize streak to zero
var pokemonName = ""; //set pokemon name as global variable
var pokemonData; //variable which holds the response from Pokemon API

//add event listener on input field and when user presses Enter key, execute the function
guess.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    checkGuess();
  }
});

//function that fetched Pokemon data from the API
const fetchPokemonData = async function getDataFromServer(url) {
  return fetch(url)
  .then(response => response.json());
}
//main function 
var main = async function mainFunction() {
  let response = await fetchPokemonData(pokemonUrl);
  pokemonData = response.results; //save API response to pokemonData variable
  getPokemon();
}

//function that compares player's guess with Pokemon name and based on that either increases or resets streak
function checkGuess() {
  if (pokemonName.toLowerCase() === guess.value.toLowerCase()) {
    streak++; //correct guess - increase streak by one
  } else {
    streak = 0; //wrong guess - reset streak
  }
  showPokemon(); //call function that will reveal a Pokemon
}
//function that generates random number, shows a Pokemon's shadow with that number and saves Pokemon name to variable
function getPokemon() {
  pokemonNameElement.innerHTML = "";
  guess.value = ""; //after user makes a guess and presses Enter, that value should be removed from input field before new guess
  let pokemonNumber = getRandomIntInclusive(offset, limit + offset); //get a random number
  pokemonName = pokemonData[pokemonNumber].name; //get pokemon name who's number is randomly generated number
  spriteElement.style.setProperty('transition', 'initial'); //reset CSS transition property 
  spriteElement.src = ""; //reset sprite URL so it has smooth transition to new Pokemon sprite
  spriteElement.style.setProperty('filter', 'brightness(0)'); //set CSS property brightness to zero of sprite element - that way shadow is created
  const sprite = spriteUrl + (pokemonNumber + 1).toString() + '.png'; //create URL to Pokemon's sprite. 
  spriteElement.src = sprite; //set URL to src property of img tag
}
//function that reveals Pokemon's sprite, shows Pokemon's name and calls getPokeon function
function showPokemon() {
  streakElement.innerHTML = "Streak: " + streak; // show new streak value
  spriteElement.style.setProperty('transition', 'filter 1s ease-out'); // add CSS property to reveal Pokemon with simple transition from shadow to normal brightness
  spriteElement.style.setProperty('filter', 'initial');
  pokemonNameElement.innerHTML = pokemonName; // show Pokemon's name
  setTimeout(() => getPokemon(), 2000); // wait two seconds before generating new Pokemon and start the same logic again
}
//function that generates random number between min value and max value.
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
//function call that starts application
main();