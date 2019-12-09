
//#region Init Variables
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
const questLog = { 
    current: 0, 
    correct: 0, 
    incorrect: 0, 
    highscores: [
        {name:'user1',score:0},
        {name:'user1',score:0},
        {name:'user1',score:0},
        {name:'user1',score:0},
        {name:'user1',score:0}
    ] 
}

if(localStorage.getItem('highscores')) {
    questLog.highscores = JSON.parse(localStorage.getItem('highscores'));
}
let quest = {};

const SEC_PER_QUEST = 15;
let secondsElapsed = 0;
let totalSeconds = getTotalRuntime();
//#endregion

//#region 

/**
 * startTimer
 * @description Starts the quiz timer
 */
function startTimer() {
    // hide start button
    btnStart.style.display = 'none';

    // render questions inside questionbox
    renderQuests();

    // start timer
    if (runtime) stopTimer();
    runtime = setInterval(function () {
        // increment elapsed time and update timerdisplay
        secondsElapsed++;
        timerDisplay.textContent = totalSeconds - secondsElapsed;

        // alert user with blinking text under SEC_PER_QUEST
        if ((totalSeconds - secondsElapsed) < SEC_PER_QUEST) {
            timerDisplay.setAttribute('class', 'blinking');
        } else {
            // else, remove class
            timerDisplay.setAttribute('class', '');
        }

        // stop quiz if they reach 0 in the timer
        if (secondsElapsed >= totalSeconds) {

            timerDisplay.setAttribute('class', '');
            alert('Sorry, you went below 0.');

            // TODO: store lowest scores and alert with Lowscores
            stopTimer();
        }
    }, 1000);
}

/**
 * stopTimer
 * @description Stops the timer
 */
function stopTimer() {
    clearInterval(runtime);
}

/**
 * restart
 * @description Restarts the quiz, updates the questlog,
 * secondsElapsed, questionBox, timerDisplay, btnStart
 */
function restart() {
    stopTimer();
    questLog.current = 0;
    questLog.correct = 0;
    questLog.incorrect = 0;
    secondsElapsed = 0;
    questionBox.textContent = "Are you ready?";
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
    // Display finished
    questionBox.textContent = "FINISHED";
    // calculate final score
    let finalScore = totalSeconds - secondsElapsed;
    
    // update timer display with final score;
    timerDisplay.textContent = finalScore;
    timerDisplay.classList.add('blueblink');

    // stop timer
    stopTimer();


    // store updated highscores
    if (finalScore > questLog.highscores[4].score) {
        let name = prompt('Enter your initials:');
        let tmp;
        let tmpName;
        let posted = false;
        for (let i = 0; i < questLog.highscores.length; i++) {
            if (!posted && finalScore > questLog.highscores[i].score) {
                tmp = questLog.highscores[i].score;
                tmpName = questLog.highscores[i].name;
                questLog.highscores[i].score = finalScore;
                questLog.highscores[i].name = name;
                posted = true;
                alert('Congrats you posted the #' + (i+1) + ' score!')
            } else if(posted && tmp > questLog.highscores[i].score) {
                let newtmp = questLog.highscores[i].score;
                let newName = questLog.highscores[i].name;
                questLog.highscores[i].score = tmp;
                questLog.highscores[i].name = tmpName;
                tmp = newtmp;
                tmpName = newName;
            }
        }

        if (!posted) {
            alert('Sorry you failed to breach the highscore list :(');
        }
    }

    localStorage.setItem('highscores', JSON.stringify(questLog.highscores));
    displayHighscores();
}

/**
 * 
 */
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

/**
 * renderQuests
 * @description Display new questions or end the quiz.
 * Uses global variables to determine end of quiz and next question.
 */
function renderQuests() {
    // Check for end condition
    if (questLog.current === quests.length){
        // end quiz
        endQuiz();
        return;
    }

    // get the current question
    quest = quests[questLog.current];

    // create p(title)
    let h1 = document.createElement('h1');
    let textNode = document.createTextNode(quest.title)
    h1.append(textNode);
    
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
        l.addEventListener('click', outcome);
    });
}

/**
 * outcome
 * @description Outcome of the user clicking on an answer.
 * Handles sounds, correct answers, iterating counter for 
 * displaying which question we are on.
 */
function outcome(event) {
    event.preventDefault();
    let isCorrect = event.target.getAttribute('data-iscorrect');
    
    if (isCorrect == 'true') {
        // play sound based on result
        playSound(SOUNDS.success);
        // increment qestLog responses
        // not sure if we need in/correct
        questLog.correct++;
        questLog.current++;
        
        // display new question
        renderQuests();
    } else {
        // increment qestLog responses
        // not sure if we need in/correct
        questLog.incorrect++;
        questLog.current++;
        // play sound based on result
        secondsElapsed += 15;
        
        // display new question
        renderQuests();
        alertFail();
        playSound(SOUNDS.fail); 
    }
}

function alertFail() {
    let wa = document.createElement('div');
        wa.classList.add('wrong-alert', 'blinking');
        wa.textContent = `-${SEC_PER_QUEST}`;
        document.querySelector('body').append(wa);
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
        'position:absolute;margin-top:30px;top:0;background:rgba(20,222,20,0.8);width:auto;height:50px;line-height:1.5em;font-size:1.5em;color:green;border:1px solid green;')
    div.textContent = msg;
    container.append(div);
    setTimeout(function () {
        container.removeChild(div);
    }, 5000)
}

// I override the window.alert because it sucks a little bit :)
window.alert = message;