const map = L.map('map').setView([50.850346, 1.351721], 3);
let questionElement = document.querySelector('#questionText'); 
let answerButtonsContainer = document.querySelector('#answer-buttons');
let correction = document.querySelector('#result-container');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

let buttons = [
  document.querySelector("#btn-find-me1"),
  document.querySelector("#btn-find-me2"),
  document.querySelector("#btn-find-me3"),
  document.querySelector("#btn-find-me4"),
  document.querySelector("#btn-find-me5")
];

let destinations = [
  [50.850346, 4.351721],  // België, Brussel
  [52.520008, 13.404954], // Duitsland, Berlijn
  [40.712776, -74.005974], // New York, USA
  [48.856613, 2.352222],  // Parijs, Frankrijk
  [-33.865143, 151.209900]  // Sydney, Australië
];

let destinationMarkers = []; 

const questions = [
  {
    question: "What is the name of the most famous monument in this city?",
    answers: ["Atomium", "Manneken Pis", "Grand Place"],
    correctAnswer: "Atomium"
  },
  {
    question: "What is the most iconic building in this city?",
    answers: ["Reichstag", "Berlin TV Tower", "Brandenburg Gate"],
    correctAnswer: "Brandenburg Gate"
  },
  {
    question: "What is the symbol of freedom in this city?",
    answers: ["Empire State Building", "Statue of Liberty", "Central Park"],
    correctAnswer: "Statue of Liberty"
  },
  {
    question: "Which monument is a world wonder in this city?",
    answers: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral"],
    correctAnswer: "Eiffel Tower"
  },
  {
    question: "What is the most famous opera house in this city?",
    answers: ["Sydney Opera House", "Harbour Bridge", "Royal Botanic Garden"],
    correctAnswer: "Sydney Opera House"
  }
];


function addDestinationMarker(destination) {
  let newMarker = L.marker(destination, {
    draggable: false,
    autoPan: true
  }).addTo(map);

  destinationMarkers.push(newMarker); 
}

function displayQuestion(index) {
  let { question, answers, correctAnswer } = questions[index];

 
  questionElement.textContent = question;

  answerButtonsContainer.innerHTML = '';


  answers.forEach(answer => {
    let button = document.createElement('button');
    button.textContent = answer;
    button.classList.add('answer-button'); 
    button.style.backgroundColor = "#c9afd7";
    button.style.borderColor = "#c9afd7";
    button.style.marginLeft = "30px";
    button.addEventListener('click', () => {
      checkAnswer(answer, correctAnswer, index);
    });
    answerButtonsContainer.appendChild(button);
  });


  resetResultMessage();
}

function checkAnswer(selectedAnswer, correctAnswer, index) {
  let resultMessage = document.querySelector('#result-message');
  if (selectedAnswer === correctAnswer) {
    resultMessage.textContent = "Correct answer!";
    correction.style.backgroundColor = "#e0ffe0";
    correction.style.border = "1px solid #70db70";

    disableAnswerButtons(index);
  } else {
    resultMessage.textContent = "Wrong answer. Try again.";
    correction.style.backgroundColor = "#914145";
    correction.style.border = "1px solid #914145";
    resultMessage.style.color = "black";
  }
}

function disableAnswerButtons(index) {
  
  let answerButtons = document.querySelectorAll('.answer-button');

 
  answerButtons.forEach((button, buttonIndex) => {
    if (buttonIndex === index) {
      button.disabled = true;
    }
  });
}

function resetResultMessage() {
  let resultMessage = document.querySelector('#result-message');
  resultMessage.textContent = ''; 
  correction.style.backgroundColor = ''; 
  correction.style.border = ''; 
}


buttons.forEach((btn, index) => {
  btn.addEventListener("click", function() {
    let destination = destinations[index];

    map.setView(destination, 13);
    addDestinationMarker(destination);

    displayQuestion(index);
  });
});

function removeAllDestinationMarkers() {
  destinationMarkers.forEach(marker => {
    map.removeLayer(marker); 
  });
  destinationMarkers = []; 
}

map.on('zoomend', () => {
  destinationMarkers.forEach(marker => {
    map.addLayer(marker); 
  });
});

