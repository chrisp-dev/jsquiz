var starterQuestions = '[{"title":"Commonly used data types DO NOT include:","choices":["strings","booleans","alerts","numbers"],"answer":"alerts"},{"title":"The condition in an if / else statement is enclosed within ____.","choices":["quotes","curly brackets","parentheses","square brackets"],"answer":"parentheses"},{"title":"What keyword creates a variable?","choices":["var","int","string","bool"],"answer":"var"}]';
var questions = [];
var quests = JSON.parse(starterQuestions);

/**
 * storeQuestions
 * @description Stores stringify'd questions list into localstorage
 */
function storeQuestions() {
  localStorage.setItem('questions', JSON.stringify(questions));
  alert('Questions updated in local storage');
}

/**
 * unpackLocal
 * @description Takes data from localstorage 
 * and inserts it into questions array
 */
function unpackLocal() {
  // get questions out of local storage
  if (localStorage.getItem('questions')) {
    questions = JSON.parse(localStorage.getItem('questions'));
  } else {
    questions = quests;
  }
}

/**
 * addQuestion
 * @description Utility to add questions in JS
 * @param {string} title 
 * @param {array} choices 
 * @param {string} answer 
 */
function addQuestion(title, choices, answer) {
  if (!title) {
    alert('please enter a title');
    return;
  }
  if (!choices || choices.length != 4) {
    alert('please give 4 possible choices');
    return;
  }
  if (!answer || !(typeof answer === 'string')) {
    alert('please provide an answer');
    return;
  }

  let newarr = questions.map(q => q.title);

  if (newarr.includes(title)) {
    alert('This question already exists!');
    return;
  }

  questions.push({ title, choices, answer });
  storeQuestions();
}

/**
 * IIFE
 * @description On page load, unpacklocal()
 */
(function () {
  unpackLocal();
})();