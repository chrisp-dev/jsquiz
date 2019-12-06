var questions = '[{"title":"Commonly used data types DO NOT include:","choices":["strings","booleans","alerts","numbers"],"answer":"alerts"},{"title":"The condition in an if / else statement is enclosed within ____.","choices":["quotes","curly brackets","parentheses","square brackets"],"answer":"parentheses"},{"title":"What keyword creates a variable?","choices":["var","int","string","bool"],"answer":"var"}]';

var quests = JSON.parse(questions);

function storeQuestions() {
  localStorage.setItem('questions', questions);
  alert('Questions updated in local storage');
}

function unpackLocal() {
  // get questions out of local storage
  if (!questions && localStorage.getItem('questions')) {
    questions = JSON.parse(localStorage.getItem('questions'));
  }
}

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

  let newarr = questions.map(q => {
    return q.title;
  });

  if (newarr.includes(title)) {
    alert('This question already exists!');
    return;
  }

  questions.push({ title, choices, answer });
  storeQuestions();
}

// init function
(function () {
  unpackLocal();
})();