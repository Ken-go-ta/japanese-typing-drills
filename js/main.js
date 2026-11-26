'use strict';

import { q0 } from "./questions/q0.js";
import { q1 } from "./questions/q1.js";
import { q2 } from "./questions/q2.js";
import { q3 } from "./questions/q3.js";
import { q4 } from "./questions/q4.js";
import { q5 } from "./questions/q5.js";
import { q6 } from "./questions/q6.js";
import { q7 } from "./questions/q7.js";


let selectedLevel = null;
let selectedLevelName = '';
let selectedQuestions = [];
const question = document.querySelector('#js-question');
const kana = document.querySelector('#js-kana');
const answer = document.querySelector('#js-answer');
const clearButton = document.querySelector('#js-clear');
const startButton = document.querySelector('#js-start');
const timeDisplay = document.querySelector('#js-time');
const answers = document.querySelector('#js-answers');
const retryButton = document.querySelector('#js-retry');
const retakeButton = document.querySelector('#js-retake');
const toHomeButton = document.querySelector('#js-toHome');
const title = document.querySelector('#js-title');
const opening = document.querySelector('#js-opening');
const qa = document.querySelector('#js-qa');
const result = document.querySelector('#js-result');
const questionNumber = document.querySelector('#js-questionNumber');
const levelBadge = document.querySelector('#js-choosenLevel');
const h1 = document.querySelector('h1');
// const totalQuestion = document.querySelector('#js-totalQuestion');
// const progressNumber = document.querySelector('#js-progressNumber');
const progress = document.querySelector("#js-progress");
const container = document.querySelector('#container');
const openingMessage = document.querySelector('#js-openingMessage');

window.addEventListener('load', () => {
    openingMessage.animate({
        opacity: [0, 1, 0],
    }, {
        duration: 3200,
        easing: 'ease-out',
        fill: 'forwards',
    });
    container.animate({
        opacity: [0, 1],
    }, {
        duration: 800,
        delay: 2700,
        easing: 'ease-out',
        fill: 'forwards',
    });
});

h1.addEventListener('click', () => location.reload());

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const levelButtons = document.querySelectorAll('.js-level');
const questionSets = {
    L0: q0,
    L1: q1,
    L2: q2,
    L3: q3,
    L4: q4,
    L5: q5,
    L6: q6,
    L7: q7,
};
  
function getRandomQuestions(questions, count = 10) {
    return shuffleArray(questions).slice(0, count);
}

let currentQuestion = 0;
let isComposing = false;
let isGameActive = false;

let startTime;
let endTime;
timeDisplay.classList.add('hidden');

// 時間を00:00:00形式に変換
function formatTime(milliseconds) {
    const totalCentiseconds = Math.floor(milliseconds / 10);
    const minutes = Math.floor(totalCentiseconds / 6000);
    const seconds = Math.floor(totalCentiseconds / 100) % 60;
    const centiseconds = totalCentiseconds % 100;
    return `<span>Your time is</span><br>${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`;
}

const reloadPage = () => {
    location.reload();
};


clearButton.disabled = true;
const numberOfQuestions = 10;

startButton.disabled = true;
levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        startButton.disabled = false;
        clearButton.disabled = false;
        selectedLevel = button.dataset.level;
        selectedLevelName = button.textContent;
        selectedQuestions = getRandomQuestions(questionSets[selectedLevel], numberOfQuestions);
        levelButtons.forEach((button) => {
            button.style.opacity = .5;
        });
        button.style.opacity = 1;
    });
});

clearButton.addEventListener('click', () => {
    selectedLevel = null;
    selectedQuestions = [];
    startButton.disabled = true;
    clearButton.disabled = true;
    levelButtons.forEach((button) => {
        button.style.opacity = 1;
    });
});

function setQuestion() {
    questionNumber.classList.remove('hidden');
    questionNumber.textContent = `Q${currentQuestion + 1}`;
    question.textContent = selectedQuestions[currentQuestion].question;
    kana.textContent = selectedQuestions[currentQuestion].kana;
    // totalQuestion.textContent = '1';
    progress.style.width = `${currentQuestion * 10}%`;
}

const hideQA = () => {
    questionNumber.classList.add('hidden');
    question.classList.add('hidden');
    kana.classList.add('hidden');
    answer.classList.add('hidden');
}
hideQA();

const hideButtons = () => {
    retryButton.classList.add('hidden');
    retakeButton.classList.add('hidden');
    toHomeButton.classList.add('hidden');
}
hideButtons();

const openingScreen = () => {
    opening.classList.remove('hidden');
    levelButtons.forEach((levelButton) => {
        levelButton.classList.remove('hidden');
    });
    clearButton.classList.remove('hidden');
    startButton.classList.remove('hidden');
    qa.classList.add('hidden');
    result.classList.add('hidden');
}
openingScreen();


const startGame = () => {
    currentQuestion = 0;
    isComposing = false;
    isGameActive = true;

    startTime = performance.now();
    setQuestion();
    hideButtons();

    opening.classList.add('hidden');
    title.classList.add('hidden');
    answers.classList.add('hidden');
    timeDisplay.classList.add('hidden');
    result.classList.add('hidden');
    startButton.classList.add('hidden');
    levelButtons.forEach((levelButton) => {
        levelButton.classList.add('hidden');
    });
    clearButton.classList.add('hidden');
    qa.classList.remove('hidden');
    question.classList.remove('hidden');
    kana.classList.remove('hidden');
    answer.classList.remove('hidden');
    answer.value = '';
    answer.focus();
    levelBadge.textContent = selectedLevelName;
    progressNumber.textContent = currentQuestion + 1;
}

startButton.addEventListener('click', startGame);


// IMEの変換開始
answer.addEventListener('compositionstart', () => {
    isComposing = true;
});

// IMEの変換終了
answer.addEventListener('compositionend', () => {
    isComposing = false;

    // IMEの変換確定後に判定
    setTimeout(() => {
        checkAnswer();
    }, 100);
});

// 入力内容の判定
answer.addEventListener('input', (event) => {

    // IMEの変換中は判定しない
    if (isComposing || event.isComposing) {
        return;
    }

    checkAnswer();
});

// 正誤判定
function checkAnswer() {
    if (!isGameActive || isComposing) return;
    const typedAnswer = answer.value;
    const currentQuestionData = selectedQuestions[currentQuestion];
    if (!currentQuestionData) return;
    if (typedAnswer === currentQuestionData.question) {
        currentQuestion++;
        if (currentQuestion === numberOfQuestions) {
            // ゲーム終了
            isGameActive = false;
            endTime = performance.now();
            const elapsedTime = endTime - startTime;
            timeDisplay.innerHTML = formatTime(elapsedTime);
            timeDisplay.classList.remove('hidden');
            const allAnswers = selectedQuestions.map((selectedQuestion) => {
                return `
                    <div class="answer_item">
                        <p class="question_feedback">${selectedQuestion.question}</p>
                        <p class="kana_feedback">${selectedQuestion.kana}</p>
                        <p class="meaning">${selectedQuestion.meaning}</p>
                    </div>
                `;
            }).join('');

            qa.classList.add('hidden');
            answers.classList.remove('hidden');
            answers.innerHTML = allAnswers;
            answer.value = '';
            hideQA();
            result.classList.remove('hidden');
            retryButton.classList.remove('hidden');
            retakeButton.classList.remove('hidden');
            toHomeButton.classList.remove('hidden');
        } else {

            // 次の問題へ
            answer.value = '';
            setQuestion();
            // progressNumber.textContent = currentQuestion + 1;
            // progress.style.width = `${(currentQuestion + 1) * 10}%`;
        
        }
    }
}

retryButton.addEventListener('click', () => {
    selectedQuestions = getRandomQuestions(questionSets[selectedLevel], numberOfQuestions);
    startGame(); 
});

retakeButton.addEventListener('click', startGame);
toHomeButton.addEventListener('click', reloadPage);