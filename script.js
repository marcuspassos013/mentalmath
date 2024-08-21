// Seleção dos elementos HTML
const exerciseForm = document.getElementById("exercise-form");
const exercisesContainer = document.getElementById("exercises-container");
const exerciseModalContainer = document.getElementById(
  "exercise-modal-container"
);
const modalContainer = document.getElementById("modal-container");
const resultsContainer = document.getElementById("results-container");
const closeModalButton = document.getElementById("close-modal");
const closeExerciseModalButton = document.getElementById(
  "close-exercise-modal"
);
const submitExercisesButton = document.getElementById("submit-exercises");
const timeSelect = document.getElementById("time-select");
const operationSelect = document.getElementById("operation-select");
const exerciseTimerElement = document.getElementById("exercise-timer");

let exercises = [];
let correctAnswers = [];
let userAnswers = [];
let timerInterval;
let timeLeft = 30;
let selectedOperations = [];
let startTime;
let endTime;

// Evento de envio do formulário
exerciseForm.addEventListener("submit", generateExercises);

function generateExercises(event) {
  event.preventDefault();

  const numExercises = Number.parseInt(
    document.getElementById("num-exercises").value
  );
  const numDigitsNum1 = Number.parseInt(
    document.getElementById("num-digits-num1").value
  );
  const numDigitsNum2 = Number.parseInt(
    document.getElementById("num-digits-num2").value
  );

  if (
    Number.isNaN(numDigitsNum1) ||
    numDigitsNum1 <= 0 ||
    Number.isNaN(numDigitsNum2) ||
    numDigitsNum2 <= 0
  ) {
    alert("Número de dígitos inválido. Por favor, selecione valores válidos.");
    return;
  }

  exercisesContainer.innerHTML = "";
  exercises = [];
  correctAnswers = [];
  userAnswers = [];
  selectedOperations = getSelectedOperations();

  if (selectedOperations.length === 0) {
    alert("Selecione pelo menos uma operação!");
    return;
  }

  timeLeft = getTimeLeft();
  startTime = new Date().getTime();

  for (let i = 0; i < numExercises; i++) {
    const exercise = createExercise(
      numDigitsNum1,
      numDigitsNum2,
      selectedOperations
    );
    exercisesContainer.appendChild(exercise);
    exercises.push(exercise);
  }

  exerciseTimerElement.textContent = `Tempo: ${timeLeft} segundos`;
  startTimer();
  exerciseModalContainer.style.display = "block";
}

function createExercise(numDigitsNum1, numDigitsNum2, operations) {
  const exercise = document.createElement("div");
  exercise.className = "exercise";

  const operation = getRandomOperation(operations);
  const num1 = getRandomNumber(numDigitsNum1);
  const num2 = getRandomNumber(numDigitsNum2);
  let correctAnswer;

  switch (operation) {
    case "adicao":
      correctAnswer = num1 + num2;
      break;
    case "subtracao":
      correctAnswer = num1 - num2;
      break;
    case "multiplicacao":
      correctAnswer = num1 * num2;
      break;
    case "potenciacao":
      correctAnswer = Math.pow(num1, num2);
      break;
    case "raizQuadrada":
      correctAnswer = Math.sqrt(num1);
      break;
  }

  const questionElement = document.createElement("p");
  questionElement.textContent = `${num1} ${getOperationSymbol(
    operation
  )} ${num2} =?`;
  exercise.appendChild(questionElement);

  const inputField = document.createElement("input");
  inputField.type = "number";
  inputField.className = "input-field";
  exercise.appendChild(inputField);

  correctAnswers.push(correctAnswer);
  return exercise;
}

function getRandomOperation(operations) {
  return operations[Math.floor(Math.random() * operations.length)];
}

function getRandomNumber(numDigits) {
  const max = 10 ** numDigits - 1;
  const min = 10 ** (numDigits - 1);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSelectedOperations() {
  const operations = [];
  const checkboxes = document.querySelectorAll(
    '#operation-select input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      operations.push(checkbox.value);
    }
  });
  return operations;
}

function getTimeLeft() {
  const timeValue = timeSelect.value;
  return Number.isNaN(Number.parseInt(timeValue))
    ? 30
    : Number.parseInt(timeValue);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    exerciseTimerElement.textContent = `Tempo: ${timeLeft} segundos`;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      showResults();
    }
  }, 1000);
}

function showResults() {
  endTime = new Date().getTime();
  const timeTaken = (endTime - startTime) / 1000;
  const timeTakenMinutes = Math.floor(timeTaken / 60);
  const timeTakenSeconds = Math.floor(timeTaken % 60);

  clearInterval(timerInterval);
  let score = 0;
  userAnswers = [];
  let resultsHTML = "";

  exercises.forEach((exercise, index) => {
    const userAnswer = Number.parseInt(exercise.querySelector("input").value);
    userAnswers.push(userAnswer);
    if (userAnswer === correctAnswers[index]) {
      score++;
      resultsHTML += `<p>${exercise.querySelector("p").textContent} = ${
        userAnswers[index]
      } (Correto)</p>`;
    } else {
      resultsHTML += `<p>${exercise.querySelector("p").textContent} = ${
        userAnswers[index]
      } (Incorreto)</p>`;
    }
  });

  resultsHTML += `<p>Tempo gasto: ${timeTakenMinutes} minutos e ${timeTakenSeconds} segundos</p>`;
  resultsHTML += `<p>Pontuação: ${score} de ${exercises.length}</p>`;

  const percentage = (score / exercises.length) * 100;

  if (percentage === 100) {
    resultsHTML += `<p>Parabéns! Você acertou 100% das questões!</p>`;
  } else if (percentage >= 80) {
    resultsHTML += `<p>Muito bem! Você acertou ${percentage.toFixed(
      2
    )}% das questões. Continue assim!</p>`;
  } else if (percentage >= 50) {
    resultsHTML += `<p>Você acertou ${percentage.toFixed(
      2
    )}% das questões. Tente se esforçar mais na próxima vez!</p>`;
  } else {
    resultsHTML += `<p>Você acertou ${percentage.toFixed(
      2
    )}% das questões. É hora de se esforçar mais!</p>`;
  }

  resultsContainer.innerHTML = resultsHTML;
  exerciseModalContainer.style.display = "none";
  modalContainer.style.display = "block";
}

// Função para obter o símbolo da operação
function getOperationSymbol(operation) {
  const operationSymbols = {
    adicao: "+",
    subtracao: "-",
    multiplicacao: "*",
    potenciacao: "^",
    raizQuadrada: "√",
  };
  return operationSymbols[operation];
}

// Adiciona eventos de clique para fechar os modais
closeModalButton.addEventListener("click", () => {
  modalContainer.style.display = "none";
});

closeExerciseModalButton.addEventListener("click", () => {
  exerciseModalContainer.style.display = "none";
});

// Adiciona evento de clique para enviar as respostas
submitExercisesButton.addEventListener("click", showResults);
