var starterQuestions = '[{"title":"Commonly used data types DO NOT include:","choices":["strings","booleans","alerts","numbers"],"answer":"alerts"},{"title":"The condition in an if / else statement is enclosed within ____.","choices":["quotes","curly brackets","parentheses","square brackets"],"answer":"parentheses"},{"title":"What keyword creates a variable?","choices":["var","int","string","bool"],"answer":"var"},{"title":"What is the use of the isNaN function?","choices":["isNaN returns true if the argument is not a number otherwise it is false","isNaN returns false if the argument is not a number otherwise it is true","isNaN returns true if the argument is not a ninja otherwise it is false","isNaN parses strings to floats"],"answer":"isNaN returns true if the argument is not a number otherwise it is false"},{"title":"Which company developed JavaScript?","choices":["Netscape","Google","Java","Microsoft"],"answer":"Netscape"},{"title":"Which symbol is used for comments in JavaScript?","choices":["#","--","//","/"],"answer":"//"},{"title":"What operator is a strict equality operator which returns true when the two operands are having the same valuue without any type conversion?","choices":["=","==","===","===="],"answer":"==="},{"title":"How do you submit a form via JavaScript?","choices":["Hit the enter button","document.form[0].submit()","location.href","addEventHandler"],"answer":"document.form[0].submit()"},{"title":"How can the style of an element be changed?","choices":["document.getElementById(myText).style.fontSize = 20","window.style.fontSize=20","css.style.change=true","edit html"],"answer":"document.getElementById(myText).style.fontSize=20"}]';

//]
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