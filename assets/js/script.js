let startButton = document.querySelector('#start-quiz-btn');
let mainElement = document.querySelector('main');
let questionCounter = -1;
let questions = [
    { 
        question: "Is this a question?",
        responses: ['Yes', 'No'],
        answer: 'Yes'
    }
];
let endQuiz = () => {
    console.log('end quiz')
}
let nextQuestion = () => {
    questionCounter++;
    if(questionCounter >= questions.length) {
        endQuiz();
    }
    let questionElements = document.createElement('div');
    questionElements.className = 'question-container';

    let questionText = document.createElement('h3');
    questionText.textContent = questions[questionCounter].question;
    questionElements.appendChild(questionText);

    let questionForm = document.createElement('form');
    for(let i = 0; i < questions[questionCounter].responses.length; i++) {
        let response = document.createElement('div');
        response.className ='response';

        let input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'response');
        input.setAttribute('id', 'question-' + i);
        input.setAttribute('question-id', i)


        response.appendChild(input);

        let label = document.createElement('label');
        label.setAttribute('for', 'question-' + i)
        label.textContent = questions[questionCounter].responses[i];

        response.appendChild(label); 
        questionForm.appendChild(response);     
    }
    questionElements.appendChild(questionForm);
    mainElement.appendChild(questionElements);
}
let startQuiz = () => {
    let landingElements = document.querySelector('.text-container');

    let loadingElements = document.createElement('div');
    loadingElements.className = 'loading-container';

    let loadingText = document.createElement('p');
    loadingText.textContent = 'Loading: 0%';

    let loadingBar = document.createElement('div')
    loadingBar.className = 'loading-bar';

    loadingElements.appendChild(loadingText);
    loadingElements.appendChild(loadingBar);

    anime.timeline({})
    .add({
        targets: landingElements,
        opacity: 0,
        duration: 1000,
        update: function(anim) {
            if(anim.progress == 100) {
                //Waits for animation to complete then removes elements from the DOM
                landingElements.remove();
                mainElement.appendChild(loadingElements);
            }
        }
    }).add({
        targets: loadingElements,
        opacity: 1,
        duration: 1000
    }).add({
        targets: loadingBar,
        width: '100%',
        duration: 2000,
        easing: 'easeOutExpo',
        update: function(anim) {
            loadingText.textContent = "Loading: " + Math.round(anim.progress) + "%";
        }
    }).add({
        targets: loadingElements,
        opacity: 0,
        duration: 1000,
        update: function(anim) {
            if(anim.progress >= 100) {
                //Waits for animation to complete then removes elements from the DOM
                loadingElements.remove();
                nextQuestion();
            }
        }
    });
}



startButton.addEventListener('click', startQuiz);