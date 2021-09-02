let highscores = [];

if (localStorage.getItem("highscores")) {
  console.log("load succesful");
  console.log(localStorage.getItem("highscores"));
  highscores = JSON.parse(localStorage.getItem("highscores"));
}
let questions = [
  {
    question: "What does HTML stand for?",
    responses: [
      "Hamburger Text McDonalds Large",
      "How To Meet Ladies",
      "Hyper Text Markup Language",
    ],
    answer: "Hyper Text Markup Language",
  },
  {
    question: "What does CSS stand for?",
    responses: [
      "Counter Strike - Source",
      "Chicken Sandwich Supreme",
      "Cascading Style Sheets",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question:
      "Making a website work on all screen sizes is called ______________",
    responses: [
      "Responsive Design",
      "Unresponsive Design",
      "Backend Development",
      "Neural Networks",
    ],
    answer: "Responsive Design",
  },
  {
    question: "What is an API?",
    responses: [
      "Object.freeze(num);",
      "num.mutable = false;",
      "Application Programming Interface",
    ],
    answer: "Application Programming Interface",
  },
  {
    question:
      "Using the const keyword to declare a variable makes the variable immutable",
    responses: ["True", "False"],
    answer: "False",
  },
  {
    question: "Primitive Types are immutable",
    responses: ["True", "False"],
    answer: "True",
  },
  {
    question:
      "Which one of the following is not best practice when declaring a variable",
    responses: [
      "let num = 2;",
      "var num = 2;",
      "const NUM = 2;",
      "const num = 2;",
    ],
    answer: "const num = 2;",
  },
];

let startButton = document.querySelector("#start-quiz-btn");
let mainElement = document.querySelector("main");

let score = 0;
const MAX_SCORE = questions.length;
let time = 30;
let quizFinished;

let addHighScore = (event) => {
  let userInput = document.querySelector("#highscore-input");
  event.preventDefault();

  if(userInput.value === "" || userInput.value.includes(' ')) {
      alert("Invalid Name. Please enter a name. You cannot leave blank and it cant contain any spaces.");
      return;
  }

  event.target.remove();
  let newScore = {
    name: userInput.value,
    score: score,
  };
  highscores.splice(
    parseInt(userInput.getAttribute("highscore-index")),
    0,
    newScore
  );
  if (highscores.length > 10) highscores.pop();

  localStorage.setItem("highscores", JSON.stringify(highscores));
  printHighscores();
  document.querySelector(".highscore-card").style.display = "flex";
};

let endQuiz = () => {
  let isHighscore = false;
  quizFinished = true;
  time = 0;
  let endElements = document.createElement("div");
  endElements.className = "end-container";

  let endTitle = document.createElement("h2");
  endTitle.textContent = "Score: " + score + "/" + MAX_SCORE;

  endElements.appendChild(endTitle);

  let endText = document.createElement("p");
  endText.textContent =
    "You scored: " + Math.round((score / MAX_SCORE) * 100) + "%";
  endElements.appendChild(endText);

  mainElement.appendChild(endElements);

  // Check to see if current score is higher than any other higscore
  for (let i = 0; i < highscores.length; i++) {
    if (score > highscores[i].score) {
      isHighscore = true;
      let formElement = document.createElement("form");

      let input = document.createElement("input");
      input.name = "highscore";
      input.id = "highscore-input";
      input.setAttribute("highscore-index", i);
      input.type = "text";
      input.placeholder = "Enter Initials";
      input.maxLength = 2;

      formElement.appendChild(input);

      let label = document.createElement("label");
      label.for = "highscore-input";

      formElement.appendChild(label);

      let button = document.createElement("button");
      button.textContent = "Enter";

      formElement.appendChild(button);

      endElements.appendChild(formElement);
      formElement.addEventListener("submit", addHighScore);

      break;
    }
  }
  //If the player score isnt higher than any current highscore check to see if highscore list is full
  if (!isHighscore && highscores.length < 10) {
    isHighscore = true;
    let formElement = document.createElement("form");

    let input = document.createElement("input");
    input.name = "highscore";
    input.id = "highscore-input";
    input.setAttribute("highscore-index", highscores.length);
    input.type = "text";
    input.placeholder = "Enter Initials";
    input.maxLength = 2;

    formElement.appendChild(input);

    let label = document.createElement("label");
    label.for = "highscore-input";

    formElement.appendChild(label);

    let button = document.createElement("button");
    button.textContent = "Enter";

    formElement.appendChild(button);

    endElements.appendChild(formElement);
    formElement.addEventListener("submit", addHighScore);
  }
};

let correct = () => {
  score++;
  time += 10;
};
let incorrect = () => (time -= 10);

let currentQuestion;

let checkAnswer = (event) => {
  let checkedButton;
  event.preventDefault();

  let radioButtonElements = document.querySelectorAll(
    ".question-container input"
  );
  console.log(radioButtonElements);
  for (let i = 0; i < radioButtonElements.length; i++) {
    if (radioButtonElements[i].checked) {
      checkedButton = document.querySelector(
        "#response-label-" + i
      ).textContent;
    }
  }
  if (!checkedButton) {
    window.alert("Please select an answer");
    return;
  }
  if (checkedButton === currentQuestion.answer) correct();
  else incorrect();

  let questionElements = document.querySelector(".question-container");

  questionElements.remove();
  if (questions.length > 0 && time > 0) nextQuestion();
  else endQuiz();
};
let nextQuestion = () => {
  let questionIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[questionIndex];
  let questionElements = document.createElement("div");
  questionElements.className = "question-container";

  let questionText = document.createElement("h3");
  questionText.textContent = currentQuestion.question;
  questionElements.appendChild(questionText);

  let questionForm = document.createElement("form");
  for (let i = 0; i < currentQuestion.responses.length; i++) {
    let response = document.createElement("div");
    response.className = "response";

    let input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "response");
    input.setAttribute("id", "response-" + i);

    response.appendChild(input);

    let label = document.createElement("label");
    label.setAttribute("for", "response-" + i);
    label.id = "response-label-" + i;
    label.textContent = currentQuestion.responses[i];
    response.appendChild(label);

    questionForm.appendChild(response);
  }

  let submitButton = document.createElement("button");

  questions.splice(questionIndex, 1);
  submitButton.textContent = "Next Question";

  if (questions.length === 0) submitButton.textContent = "Finish";

  submitButton.className = "question-submit";
  submitButton.type = "submit";
  questionForm.addEventListener("submit", checkAnswer);

  questionForm.appendChild(submitButton);

  questionElements.appendChild(questionForm);
  mainElement.appendChild(questionElements);
};
let startQuiz = () => {
  quizFinished = false;
  let landingElements = document.querySelector(".text-container");

  landingElements.remove();

  nextQuestion();
  window.requestAnimationFrame(quizLoop);
};

let secondsPassed;
let oldTimeStamp = 0;

function quizLoop(timeStamp) {
  // Calculate the number of seconds passed since the last frame
  if ((secondsPassed = (timeStamp - oldTimeStamp) - 1000 >= 0)) {
    oldTimeStamp = timeStamp;
    time--;
    if (time < 0) time = 0;
  }
  if (time <= 0 && !quizFinished) {
    quizFinished = true;
    time = 0;
    let questionElements = document.querySelector(".question-container");
    questionElements.remove();

    endQuiz();
  }
  document.querySelector(".timer-text").textContent = time;

  let timerCircle = document.querySelector(".timer-circle");
  let timerCap = document.querySelector(".timer-cap");
  if (time <= 5) {
    timerCap.style.background = "rgb(255, 0, 0)";
    timerCircle.style.borderColor = "rgb(255, 0, 0)";
  } else if (time <= 10) {
    timerCap.style.background = "rgb(255, 150, 0)";
    timerCircle.style.borderColor = "rgb(255, 150, 0)";
  } else if (time <= 20) {
    timerCap.style.background = "rgb(255, 200, 0)";
    timerCircle.style.borderColor = "rgb(255, 200, 0)";
  } else {
    timerCap.style.background = "rgb(0, 255, 0)";
    timerCircle.style.borderColor = "rgb(0, 255, 0)";
  }
  // The loop function has reached it's end. Keep requesting new frames
  window.requestAnimationFrame(quizLoop);
}

let printHighscores = () => {
  let higscoreListEl = document.querySelector(".highscore-card ol");
  higscoreListEl.innerHTML = "";

  if (highscores.length === 0) higscoreListEl.innerHTML = "none";
  for (let i = 0; i < highscores.length; i++) {
    let listEl = document.createElement("li");
    listEl.className = "highscore-item";

    listEl.innerHTML =
      "<span>" + highscores[i].name + "</span> " + highscores[i].score;

    higscoreListEl.appendChild(listEl);
  }
};
printHighscores();

document
  .querySelector("#highscore-btn")
  .addEventListener(
    "click",
    () => (document.querySelector(".highscore-card").style.display = "flex")
  );

document
  .querySelector("#exit-highscore")
  .addEventListener(
    "click",
    () => (document.querySelector(".highscore-card").style.display = "none")
  );

startButton.addEventListener("click", startQuiz);
