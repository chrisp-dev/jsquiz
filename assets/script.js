
let btnStart = document.querySelector('#start-quiz');
let btnRestart = document.querySelector('.header p');
let timerDisplay = document.querySelector('#timer');
let questionBox = document.querySelector('.question-box');
let runtime = false;
let container = document.querySelector('.container');

const SOUNDS = {
    fail: '/assets/button-09.mp3',
    success: '/assets/button-10.mp3'
}

const questLog = { correct: 0, incorrect: 0, highscores: [] }


const SEC_PER_QUEST = 15;

// start quiz:
// 1. timer begins
function startTimer() {
    // hide start button
    btnStart.style.display = 'none';

    // start timer
    if (runtime) clearInterval(runtime);
    runtime = setInterval(function () {

    }, 1000);
}

function stopTimer() {

}

function restart() {

}

function getTotalRuntime() {
    return questList.length * SEC_PER_QUEST;
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
    startTimer();
});

btnRestart.addEventListener("click", function (event) {
    restart();
});

questionBox.addEventListener("click", function(event) {
    event.preventDefault();
    let isCorrect = event.target.getAttribute('data-iscorrect');
    if (!isCorrect) {
        playSound(SOUNDS.success);
    } else {
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