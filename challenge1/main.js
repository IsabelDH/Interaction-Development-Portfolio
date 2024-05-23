let questions = [
    { question: "What is 2 + 2?", answer: "Four" },
    { question: "How many liters of water should you drink per day?", answer: "Two" },
    { question: "Where is Disneyland located in Europe?", answer: "Paris" },
    { question: "What is the capital of Belgium?", answer: "Brussels" },
    { question: "What is the capital of Germany?", answer: "Berlin" },
    { question: "How many continents are there?", answer: "Seven" },
    { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" }
    
];

let currentQuestionIndex = 0;

let questionElement = document.querySelector('#question');
let resultElement = document.querySelector('#result');
let speakQuestionButton = document.querySelector('#speakQuestionButton');
let answerButton = document.querySelector('#answerButton');
let nextButton = document.querySelector('#nextButton');
let replayButton = document.querySelector('#replayButton');

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
recognition.lang = 'en-US';

let synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();
utterance.lang = 'en-US';
utterance.pitch = 1.2;
utterance.rate = 0.9;

function speakQuestion(questionText) {
    utterance.text = questionText;
    synth.speak(utterance);
}

speakQuestionButton.addEventListener('click', function() {
    speakQuestion(questions[currentQuestionIndex].question);
    answerButton.disabled = false;
});

answerButton.addEventListener('click', function() {
    recognition.start();
});

recognition.onresult = function(event) {
    let answer = event.results[0][0].transcript.trim().toLowerCase();
    let correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();
    if (answer === correctAnswer) {
        resultElement.textContent = 'Correct🎆!';
        resultElement.style.color = "green";
        resultElement.style.fontSize = "38px";
        nextButton.style.display = 'inline-block';
        speakQuestionButton.style.display = 'none';
        answerButton.style.display = 'none';
        questionElement.style.display = 'none';
    } else {
        resultElement.textContent = 'Wrong! Try again.';
        resultElement.style.color = "red";
        resultElement.style.fontSize = "38px";
        nextButton.style.display = 'none';
        answerButton.disabled = false;
    }
}

nextButton.addEventListener('click', function() {
    resultElement.textContent = '';
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        questionElement.textContent = questions[currentQuestionIndex].question;
        speakQuestionButton.style.display = 'inline-block';
        answerButton.style.display = 'inline-block';
        questionElement.style.display = 'inline-block';
        nextButton.style.display = 'none';
    } else {
        speakQuestionButton.disabled = true;
        answerButton.disabled = true;
        nextButton.style.display = 'none';
        replayButton.style.display = 'inline-block';
    }
});

replayButton.addEventListener('click', function() {
    currentQuestionIndex = 0;
    resultElement.textContent = '';
    questionElement.textContent = 'Good job! The quiz is finished!!!';
    questionElement.style.color = "#6e069f";
    speakQuestionButton.style.display = 'inline-block';
    answerButton.style.display = 'inline-block';
    questionElement.style.display = 'inline-block';
    nextButton.style.display = 'none';
    replayButton.style.display = 'none';
    speakQuestionButton.disabled = false;
    answerButton.disabled = true;
});
questionElement.textContent = questions[currentQuestionIndex].question;
speakQuestionButton.disabled = false;
answerButton.disabled = true;

