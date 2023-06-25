// Define the questions and their answers
const questions = [
  {
      logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/750aea37-5cf0-42ff-8d32-92fa0313865d',
      logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/1f8f0143-d590-405a-9a1c-589436dd9535',
      answer: 2
  },
  {
      logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/66d9ab65-0428-475b-a178-52833a1044d1',
      logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/8cf4bb3f-de79-4a59-b92a-7e411575d99e',
      answer: 1
  },
  {
    logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/e44dbeab-d73e-4e51-a739-d3293a1e164a',
    logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/6e4fb08f-25ea-4364-8f49-7b0dc9bad7e4',
    answer: 2
  },
  {
    logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/2d46616b-78a5-4990-8bc9-8d2c7f505b12',
    logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/b311c4d3-5451-4640-8b65-7d78295e6e4a',
    answer: 1
  },
  {
    logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/1810ac9d-c474-40ee-a28b-7333adf19a98',
    logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/5dc07bdf-3137-4b28-8605-70df5fdcb893',
    answer: 2
  },
  { 
  logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/f3a7cd2a-7d56-4a8d-b8b0-69f0ec22ef36',
  logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/f16d5ddc-9a69-414d-aa71-7c379383ddbe',
  answer: 2
  },
  {
    logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/6e997647-35d9-41bc-93ba-ec2d9c563eae',
    logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/0057ef3a-d83f-4f85-b5f0-e71e246c0c0d',
    answer: 1
  },
  {
  logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/8b20d8ba-a191-4884-bb35-578aba4eae05',
  logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/4daf4826-f64c-41f1-a0a3-3ae3d661f070',
  answer: 2
  },
  {
  logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/7ab92557-7cd6-4267-8de0-91bad53ce014',
  logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/f7ebaf66-5f1c-4b1e-90f7-0f5677c8e3a3',
  answer: 2
  },
  {
  logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/dd5b1ea8-cbdc-4051-a6c2-255975d3d0ca',
  logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/e31233c6-4127-4ceb-bbba-904a49c39da7',
  answer: 1
  },
  {
  logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/c77cf3ac-3aed-40d6-8795-803b876e8f08',
  logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/f60b2776-43ea-438b-9cdb-59950b263db5',
  answer: 2
  },
  {
    logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/0dd06949-4180-4e53-a875-6d95a9f5ac0a',
    logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/8e20e1cb-625c-484f-818c-aeaae7c11932',
    answer: 1
  },
  {
    logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/106dec99-ae8f-4603-b077-d6633c8e5a81',
    logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/fcd522ed-fcfd-4fd2-882a-91c96ccdcfa1',
    answer: 1
  },
  {
    logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/8414f83d-c07c-4436-8056-d29945fb07de',
    logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/dc62b33b-d0d2-44d2-b05d-07b87eb1ebcc',
    answer: 2
  },
  {
    logo1: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/352d98dd-abf8-4aa8-9275-f461e67aa32d',
    logo2: 'https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/dc765950-e820-4cb5-b574-c7fe59af73be',
    answer: 2
  }, 
];

let currentQuestion = 0;
let score = 0;
let timerSeconds=30;
var timerInterval;

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timerSeconds--;
  document.getElementById("timer").textContent = "Time-left: " + timerSeconds+ " sec";

  if (timerSeconds === 0) {
    endGame();
  }
}

// Display the question and choices
function displayQuestion() {
  if (currentQuestion >= questions.length) {
      endGame();
      return;
  }

  const question = questions[currentQuestion];
  document.getElementById('question').innerHTML = '';
  document.getElementById('choice1').src = question.logo1;
  document.getElementById('choice2').src = question.logo2;
}

// Check the user's answer
function checkAnswer(choice) {
  const selectedAnswer = choice.id === 'choice1' ? 1 : 2;
  const question = questions[currentQuestion];

  if (selectedAnswer === question.answer) {
      score++;
  }

  currentQuestion++;
  displayQuestion();
}

// Start the game
function startGame() {
  currentQuestion = 0;
  score = 0;
  displayQuestion();

}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById('question').innerHTML = '';
  document.getElementById('choices').innerHTML = '';
  document.getElementById('score').innerHTML = `Time's up! Your score: ${score}/${questions.length}`;
}

// Start the game when the page loads
window.onload = startGame;
startTimer();