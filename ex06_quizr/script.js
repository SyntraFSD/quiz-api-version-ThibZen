// #answer-container
const htmlAnswerContainer = document.querySelector('#answer-container');
// #question
const htmlQuestion = document.querySelector('#question');
// #total-correct
const htmlTotal = document.querySelector('#total-correct');
// save scrambled array here
let scrambledQuestions;

function initResults() {
  // select all elements with class .result
  // remove classes is-success and is-danger
  // add class is-dark
  document.querySelectorAll('.result').forEach(function (result) {
    result.classList.remove('is-success', 'is-danger');
    result.classList.add('is-dark');
  });
}

function changeTotal(total) {
  // change htmlTotal
  htmlTotal.textContent = total;
}

function changeQuestionIndex(questionIndex) {
  // change data-index in htmlQuestion
  htmlQuestion.dataset.index = questionIndex;
}

function changeQuestion(questionIndex) {
  // change textContent of htmlQuestion to the correct question (with questionIndex)
  // if no question is available (if all questions are answered) use following
  // 'Your score is 6. Wanna try again?'
  // of course 6 should be replaced by the correct number
  if (questionIndex >= scrambledQuestions.length) {
    htmlQuestion.textContent = 'Your score is ' + htmlTotal.textContent
      + '. Wanna try again?';
  } else {
    htmlQuestion.textContent = scrambledQuestions[questionIndex].question;
  }
}

function getQuestions(){
 const request = new XMLHttpRequest();
 request.addEventListener('readystatechange', function(event){
   const response = event.target;
   if(response.readyState === 4 && response.status === 200) {
     const responseText = JSON.parse(response.responseText);
     if(responseText.response_code === 0){
       init(responseText.results);
     };
     //console.log(event);
   }
 });
 request.open('GET', 'https://opentdb.com/api.php?amount=10&type=boolean');
 request.send();
}

function init(questions) {
  // this function initializes the quiz
  // no need to edit this function
  scrambledQuestions = questions;
  initResults();
  changeTotal(0);
  changeQuestionIndex(0);
  changeQuestion(0);
}

function answeredCorrectly(questionIndex) {
  // update the correct .result element use questionIndex
  // remove class is-dark
  // add class is-success
  // change total
  const currentResultElement = document.querySelector('.result:nth-child(' + (questionIndex + 1) + ')');
  currentResultElement.classList.remove('is-dark');
  currentResultElement.classList.add('is-success');
  changeTotal(parseInt(htmlTotal.textContent) + 1);
}

function answeredIncorrectly(questionIndex) {
  // update the correct .result element use questionIndex
  // remove class is-dark
  // add class is-danger
  const currentResultElement = document.querySelector('.result:nth-child(' + (questionIndex + 1) + ')');
  currentResultElement.classList.remove('is-dark');
  currentResultElement.classList.add('is-danger');
}

function answered(event) {
  // play the solution and make it work!!!
  if (event.target.matches('.answer')) {
    const questionIndex = parseInt(htmlQuestion.dataset.index);
    const givenAnswer = event.target.textContent;
    if (questionIndex >= scrambledQuestions.length) {
      if (givenAnswer === 'True') {
        getQuestions();
      }
    } else {
      const  correctAnswer  = scrambledQuestions[questionIndex].correct_answer;
      if (givenAnswer === correctAnswer) {
        answeredCorrectly(questionIndex);
      } else {
        answeredIncorrectly(questionIndex);
      }
      changeQuestionIndex(questionIndex + 1);
      changeQuestion(questionIndex + 1);
    }
  }
}

htmlAnswerContainer.addEventListener('click', answered);
getQuestions();
