
let btnStart = document.querySelector('#start-quiz');
let btnRestart = document.querySelector('#restart');
let btnHighscores = document.querySelector('#highscores');
let timerDisplay = document.querySelector('#timer');
let questionBox = document.querySelector('.question-box');
let btnAnswers = document.querySelector('.question-box ul');
let runtime = false;
let container = document.querySelector('.container');

// fail/success sounds
var soundUrls = [
    "https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3",
    "https://www.soundjay.com/misc/sounds/magic-chime-02.mp3"]

const SOUNDS = {
    fail: soundUrls[0],
    success: soundUrls[1],
}

// score tracker
const questLog = { current: 0, correct: 0, incorrect: 0, highscores: [{name:'user1',score:0},{name:'user1',score:0},{name:'user1',score:0},{name:'user1',score:0},{name:'user1',score:0}] }
if(localStorage.getItem('highscores')) {
    questLog.highscores = JSON.parse(localStorage.getItem('highscores'));
}
let quest = {};

const SEC_PER_QUEST = 15;
let secondsElapsed = 0;
let totalSeconds = getTotalRuntime();

// start quiz:
// 1. timer begins
function startTimer() {
    // hide start button
    btnStart.style.display = 'none';
    renderQuests();

    // start timer
    if (runtime) stopTimer();
    runtime = setInterval(function () {
        secondsElapsed++;
        timerDisplay.textContent = totalSeconds - secondsElapsed;

        if ((totalSeconds - secondsElapsed) < SEC_PER_QUEST) {
            timerDisplay.setAttribute('class', 'blinking');
        } else {
            timerDisplay.setAttribute('class', '');
        }
        if (secondsElapsed >= totalSeconds) {
            timerDisplay.setAttribute('class', '');
            alert('Sorry, you stink');
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(runtime);
}

/**
 * restart
 * @description Restarts the quiz
 */
function restart() {
    stopTimer();
    questLog.current = 0;
    questLog.correct = 0;
    questLog.incorrect = 0;
    secondsElapsed = 0;
    btnStart.style.display = 'block';
    timerDisplay.setAttribute('class', '');
    timerDisplay.textContent = 0;
}

/**
 * getTotalRuntime
 * @description returns the total length of the quiz
 */
function getTotalRuntime() {
    return questions.length * SEC_PER_QUEST;
}

/**
 * endQuiz
 * @description Stops timer, posts final score and standing if possible
 */
function endQuiz() {
    stopTimer();
    let finalScore = totalSeconds - secondsElapsed;
    
    // update timer display with final score;
    timerDisplay.textContent = finalScore;
    timerDisplay.classList.add('blueblink');

    // store highscores
    if (finalScore > questLog.highscores[4].score) {
        let tmp;
        let posted = false;
        for (let i = 0; i < questLog.highscores.length; i++) {
            if (!posted && finalScore > questLog.highscores[i].score) {
                tmp = questLog.highscores[i].score;
                questLog.highscores[i].score = finalScore;
                questLog.highscores[i].name = new Date();
                posted = true;
                alert('Congrats you posted the #' + (i+1) + ' score!')
            } else if(posted && tmp > questLog.highscores[i].score) {
                let newtmp = questLog.highscores[i].score;
                questLog.highscores[i].score = tmp;
                tmp = newtmp;
            }
        }
    }

    localStorage.setItem('highscores', JSON.stringify(questLog.highscores));
    displayHighscores();
}

function displayHighscores() {
    let highscores = JSON.parse(localStorage.getItem('highscores'));
    questionBox.textContent = "";

    let ul = document.createElement('ul');
    
    highscores.forEach((high, i) => {
        let li = document.createElement('li');
        console.log(high);
        li.textContent = `#${i+1} ${high.name} -> ${high.score}`;
        ul.append(li);
    });

    questionBox.append(ul);
}

function renderQuests() {
    // Check for end condition
    if (questLog.current === quests.length){
        endQuiz();
        questionBox.textContent = "FINISHED";
        return;
    }

    // get the current question
    quest = quests[questLog.current];

    // create p(title)
    let h1 = document.createElement('p');
    h1.textContent = quest.title;
    
    // and create ul(question list)
    let list = document.createElement('ul');

    // for each question choice
    quest.choices.forEach(choice => {
        // and create li(question items)
        let li = document.createElement('li');
        li.textContent = choice;

        // set data-iscorrect to true if the choice === answer
        if (quest.answer === choice) li.setAttribute('data-iscorrect', 'true');

        // add question to question list
        list.append(li)
    });

    // clear the questionBox
    questionBox.textContent = "";

    // append the title
    questionBox.appendChild(h1);

    // append the list
    questionBox.appendChild(list);

    // gather all the question elements
    let answers = document.querySelectorAll('li');

    // setup the click handler
    answers.forEach(l => {
        l.addEventListener('click', addClickEvent);
    });
}

/**
 * addClickEvent
 * @description Handles sounds, correct answers, iterating counter for 
 * displaying which question we are on.
 * @param {EventListenerOrEventListenerObject} event 
 */
function addClickEvent(event) {
    event.preventDefault();
    let isCorrect = event.target.getAttribute('data-iscorrect');
    console.log('iscorrect: ' + isCorrect);
    if (isCorrect == 'true') {
        playSound(SOUNDS.success);
        questLog.correct++;
        questLog.current++;
        renderQuests();
    } else {
        questLog.incorrect++;
        questLog.current++;
        renderQuests();
        secondsElapsed += 15;
        let wa = document.querySelector('.wrong-alert');
        let top = 75;
        wa.style.display = 'block';
        let timer = setInterval(function () {
            top -= 15;
            wa.style.top = top + "%";
            if (top === -150) {
                wa.style.display = 'none';
                wa.style.top = 50 + "%";
                clearInterval(timer);
            }
        }, 100)
        playSound(SOUNDS.fail);
    }
}

/**
 * playSound
 * @description Takes a sound url and plays it
 * @param {url} sound 
 */
function playSound(sound) {
    let audio = new Audio(sound);
    audio.play();
}

// click event listeners
btnStart.addEventListener("click", function (event) {
    timerDisplay.textContent = totalSeconds;
    startTimer();
});

btnRestart.addEventListener("click", function (event) {
    restart();
});

btnHighscores.addEventListener("click", function(event) {
    displayHighscores();
});

// Message > Alert
function message(msg) {
    let div = document.createElement('div');
    div.setAttribute('style',
        'position:absolute;margin-top:20px;top:0;background:rgba(20,222,20,0.8);width:auto;height:50px;line-height:1.5em;font-size:1.5em;color:green;border:1px solid green;')
    div.textContent = msg;
    container.append(div);
    setTimeout(function () {
        container.removeChild(div);
    }, 2000)
}

// I override the window.alert because it sucks a little bit :)
window.alert = message;