
let btnStart = document.querySelector('#start-quiz');
let btnRestart = document.querySelector('.header p');
let timerDisplay = document.querySelector('#timer');
let questionBox = document.querySelector('.question-box');
let btnAnswers = document.querySelector('.question-box ul');
let runtime = false;
let container = document.querySelector('.container');

var inputs = ["https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3",
            "https://www.soundjay.com/misc/sounds/fail-buzzer-04.mp3"]
 

const SOUNDS = {
    fail: inputs[0],
    success: inputs[1],
}

const questLog = { correct: 0, incorrect: 0, highscores: [] }


const SEC_PER_QUEST = 15;
let secondsElapsed = 0;
let totalSeconds = getTotalRuntime();

// start quiz:
// 1. timer begins
function startTimer() {
    // hide start button
    btnStart.style.display = 'none';

    // start timer
    if (runtime) clearInterval(runtime);
    runtime = setInterval(function () {
        secondsElapsed++;
        timerDisplay.textContent = totalSeconds-secondsElapsed;

        if ((totalSeconds-secondsElapsed) < SEC_PER_QUEST) {
            timerDisplay.setAttribute('class','blinking');
        } else {
            timerDisplay.setAttribute('class','');
        }
        if (secondsElapsed === totalSeconds) {
            timerDisplay.setAttribute('class','');
            alert('Sorry, you stink');
            clearInterval(runtime);
        }
    }, 1000);
}

function stopTimer() {

}

function restart() {
    clearInterval(runtime);
    btnStart.style.display = 'block';
    timerDisplay.setAttribute('class','');
    timerDisplay.textContent = 0;
}

function getTotalRuntime() {
    return quests.length * SEC_PER_QUEST;
}

// 2. question appears
// 3. User completes quiz
// 4. User receives final score
// 5. store highscores
// 6. for fun, store lowest scores

function renderQuests(quest) {
    let list = document.createElement('ul');
    questionBox.innerHTML = list;
    quest.choices.forEach(choice => {
        let li = document.createElement('li');
        li.textContent = choice;
        if (quest.answer === choice) li.setAttribute('data-iscorrect', 'true');
        questionBox.append(li)
    });
}

function playSound(sound) {
    let audio = new Audio(sound);
    audio.play();
  }


btnStart.addEventListener("click", function (event) {
    timerDisplay.textContent = totalSeconds;
    startTimer();
});

btnRestart.addEventListener("click", function (event) {
    restart();
});

btnAnswers.addEventListener("click", function(event) {
    event.preventDefault();
    let isCorrect = event.target.getAttribute('data-iscorrect');
    console.log(isCorrect);
    if (isCorrect === true) {
        playSound(SOUNDS.success);
    } else {
        secondsElapsed+=15;
        playSound(SOUNDS.fail);
    }
})



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

window.alert = message;