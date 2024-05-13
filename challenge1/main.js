const questions = [
    { question: "What is 2 + 2?", answer: "Four" },
    { question: "How many liters of water should you drink per day?", answer: "Two" },
    { question: "Where is Disneyland located in Europe?", answer: "Paris" },
    { question: "What is the capital of Belgium?", answer: "Brussels" },
];

let currentQuestionIndex = 0;

const questionElement = document.querySelector('#question');
const resultElement = document.querySelector('#result');
const speakQuestionButton = document.querySelector('#speakQuestionButton');
const answerButton = document.querySelector('#answerButton');
const nextButton = document.querySelector('#nextButton');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

const synth = window.speechSynthesis;
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
    const answer = event.results[0][0].transcript.trim().toLowerCase();
    const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();
    if (answer === correctAnswer) {
        resultElement.textContent = 'Correct🎆!';
        resultElement.style.color = "#6e069f";
        resultElement.style.fontSize = "38px";
        nextButton.style.display = 'inline-block';
        speakQuestionButton.style.display = 'none';
        answerButton.style.display = 'none';
        questionElement.style.display = 'none';
    } else {
        resultElement.textContent = 'Wrong! Try again.';
        resultElement.style.color = "black";
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
        questionElement.textContent = 'Good job! The quiz is finished!!!';
        questionElement.style.color = "#6e069f";
        speakQuestionButton.disabled = true;
        answerButton.disabled = true;
        nextButton.style.display = 'none';
    }
});


questionElement.textContent = questions[currentQuestionIndex].question;
speakQuestionButton.disabled = false;
answerButton.disabled = true;

