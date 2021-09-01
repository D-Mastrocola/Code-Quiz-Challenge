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
      "Which line of code will change (var myVar = 'Hello World';) so that console.log(myVar) will return 'HELLO WORLD'",
    responses: [
      "myVar.toUpperCase();",
      "var myVarUpperCase = myVar.toUpperCase();",
      "var myVar = 'hello world'",
    ],
    answer: "var myVarUpperCase = myVar.toUpperCase();",
  },
];

let startButton = document.querySelector("#start-quiz-btn");
let mainElement = document.querySelector("main");

let score = 0;
const MAX_SCORE = questions.length;
let time = 30;
let quizFinished;

let endQuiz = () => {
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
};

let correct = () => {
  score++;
  time += 10;
};
let incorrect = () => (time -= 10);

let currentQuestion;

let checkAnswer = (event) => {
  let isRight = false;
  event.preventDefault();

  let radioButtonElements = document.querySelectorAll(
    ".question-container input"
  );
  console.log(radioButtonElements);
  for (let i = 0; i < radioButtonElements.length; i++) {
    if (radioButtonElements[i].checked) {
      if (
        document.querySelector("#response-label-" + i).textContent ===
        currentQuestion.answer
      ) {
        isRight = true;
        break;
      }
    }
  }
  if (isRight) correct();
  else incorrect();

  let questionElements = document.querySelector(".question-container");

  anime.timeline({}).add({
    targets: questionElements,
    opacity: 0,
    duration: 500,
    easing: "linear",
    update: function (anim) {
      if (anim.progress >= 100) {
        //Waits for animation to complete then removes elements from the DOM
        questionElements.remove();
        if (questions.length > 0) nextQuestion();
        else endQuiz();
      }
    },
  });
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

  let loadingElements = document.createElement("div");
  loadingElements.className = "loading-container";

  let loadingText = document.createElement("p");
  loadingText.textContent = "Loading: 0%";

  let loadingBar = document.createElement("div");
  loadingBar.className = "loading-bar";

  loadingElements.appendChild(loadingText);
  loadingElements.appendChild(loadingBar);

  anime
    .timeline({})
    .add({
      targets: landingElements,
      opacity: 0,
      duration: 1000,
      update: function (anim) {
        if (anim.progress == 100) {
          //Waits for animation to complete then removes elements from the DOM
          landingElements.remove();
          mainElement.appendChild(loadingElements);
        }
      },
    })
    .add({
      targets: loadingElements,
      opacity: 1,
      duration: 1000,
    })
    .add({
      targets: loadingBar,
      width: "100%",
      duration: 2000,
      easing: "easeOutExpo",
      update: function (anim) {
        loadingText.textContent = "Loading: " + Math.round(anim.progress) + "%";
      },
    })
    .add({
      targets: loadingElements,
      opacity: 0,
      duration: 1000,
      update: function (anim) {
        if (anim.progress === 100) {
          //Waits for animation to complete then removes elements from the DOM
          loadingElements.remove();
          nextQuestion();
          window.requestAnimationFrame(quizLoop);
        }
      },
    });
};

startButton.addEventListener("click", startQuiz);

let secondsPassed;
let oldTimeStamp = 0;

function quizLoop(timeStamp) {
  if (!quizFinished) {
    // Calculate the number of seconds passed since the last frame
    if ((secondsPassed = (timeStamp - oldTimeStamp) / 1000 >= 1)) {
      oldTimeStamp = timeStamp;
      time--;
    }
    //Changes HTML timer element
    document.querySelector(".timer-text").textContent = time;

    if (time <= 0) {
      quizFinished = true;
      time = 0;
      let questionElements = document.querySelector(".question-container");
      anime.timeline({}).add({
        targets: questionElements,
        opacity: 0,
        duration: 500,
        easing: "linear",
        update: function (anim) {
          if (anim.progress === 100) {
            //Waits for animation to complete then removes elements from the DOM
            questionElements.remove();

            endQuiz();
            document.querySelector(".timer-text").textContent = time;
          }
        },
      });
    }
    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(quizLoop);
  }
}
