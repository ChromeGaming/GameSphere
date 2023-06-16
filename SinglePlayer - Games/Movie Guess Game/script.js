// API Keys
let MOVIEDB_API_KEY = '';
let GIPHY_API_KEY = '';

while (MOVIEDB_API_KEY === '') MOVIEDB_API_KEY = prompt('Enter IMDB API Key - ');
while (GIPHY_API_KEY === '') GIPHY_API_KEY = prompt('Enter Giphy API Key - ');

// Global Variables
let moves = 0;
let moviesArray;

// Audio elements
const bgMusic = new Audio('./sounds/bgMusic.mp3');
bgMusic.volume = 0.3;
const correctAns = new Audio('./sounds/correct.mp3');
const gameOver = new Audio('./sounds/gameOver.wav');
const wrongAns = new Audio('./sounds/wrong.mp3');

async function getMoviesPage(pageNum) {
    $.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${MOVIEDB_API_KEY}&page=${pageNum}`, response => {
        const movieTitles = response.results.map(movie => movie.title);
        moviesArray.push(...movieTitles);
    });
}

// restore moviesArray each time getAllMovies is invoked (reset game);
async function getAllMovies() {
    moviesArray = [];
    for (let i = 1; i <= 5; i++) {
        await getMoviesPage(i);
    }
}

function randomElement(array) {
    const length = array.length;
    const randomIndex = Math.floor(Math.random() * length);
    return array[randomIndex];
}

function getRandomMovies(array, movieAmount) {
    let newArray = [];
    for (let i = 0; i < movieAmount; i++) {
        newArray.push(randomElement(array));
    }
    return newArray;
}

function prepareMoviesAndGifData(array) {
    // 10 movies per set
    const randomMovies = getRandomMovies(array, 10);
    // 1 movie out of 10 selected - goes also to GIF request
    const randomMovie = getRandomMovies(randomMovies, 1);
    return [randomMovies, randomMovie[0]];
}

async function getAndRenderGif(movieTitle) {
    $.get(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${movieTitle}&limit=20&offset=0&rating=G&lang=en`, response => {
        return response.data;
    })
        .then(gifs => {
            const gif = $('#giphy');
            gif.data('title', movieTitle);
            gif.attr('src', randomElement(gifs.data).images['original'].url);
        });
}

function filterAndShuffleMovies(array, movie) {
    let movieList = [movie];
    for (let i = 0; i < 3; i++) {
        const movie = randomElement(array);
        // push unique title, otherwise count again
        !movieList.includes(movie) ? movieList.push(movie) : i--;
    }
    // returns randomly sorted movieList array
    return movieList.sort(() => Math.random() - 0.5);
}

function renderMovieTitles(array) {
    const movieList = $('#movies');
    for (let i = 0; i < 4; i++) {
        movieList.append(`<button class="movie ui button" style="background-color: rgba(255, 255, 255, 0.4)">${array[i]}</button>`);
    }
}

function checkAnswer(htmlElement) {
    const correntAnswer = $('#giphy').data('title');
    const result = htmlElement.innerText === correntAnswer;
    const answers = Number($('#answers').text());

    moves++;

    if (moves === 10) {
        gameOver.play();
        if (result) { $('#answers').text(answers + 1) }
        $('#final-score').text($('#answers').text());
        $('.ui.modal.end-game').modal('setting', 'closable', false).modal('show');
    } else {
        if (result) {
            correctAns.play();
            $('#answers').text(answers + 1);
            $('.ui.modal.correct').modal('show');
        } else {
            wrongAns.play();
            $('.ui.modal.incorrect').modal('show');
        }
    }
    return result;
}

function renderAllComponents(array) {
    const moviesData = prepareMoviesAndGifData(moviesArray);
    const [tenMovies, oneMovie] = moviesData;
    const filteredMovies = filterAndShuffleMovies(tenMovies, oneMovie);
    renderMovieTitles(filteredMovies);
    getAndRenderGif(oneMovie);
}

function updateComponents() {
    $('.movie').remove();
}

function startGame() {
    getAllMovies();
    setTimeout(() => {
        renderAllComponents(moviesArray);
        $('#giphy').css('opacity', '1');
    }, 1000);
}

function restartGame() {
    moves = 0;
    moviesArray = [];
    $('#answers').text(moves);
    updateComponents();
    startGame();
}

$('#giphy').on('click', (event) => {
    console.log($(event.target).data('title'));
});

$('#movies').on('click', '.movie', (event) => {
    $('#giphy').css('opacity', '0');
    const answer = checkAnswer(event.target);
    updateComponents(answer);
    renderAllComponents();
});

$('.actions').on('click', '.next', () => {
    $('#giphy').css('opacity', '1');
});

$('#restart').on('click', restartGame);

document.addEventListener('click', () => {
    bgMusic.play();
});

startGame();
