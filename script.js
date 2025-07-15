import { calculatePersonality, calculateCompatibility, getCompatibilityLevel } from './scoring.js';

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const quizTitle = document.getElementById('quiz-title');
const questionArea = document.getElementById('question-area');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const progressTracker = document.getElementById('progress-tracker');

let questions = [];
let types = [];
let currentUser = 1;
let currentQuestionIndex = 0;
let user1Answers = [];
let user1AnswerIndices = [];
let user2Answers = [];
let user2AnswerIndices = [];

async function loadData() {
    try {
        const [questionsRes, typesRes] = await Promise.all([
            fetch('questions.json'),
            fetch('types.json')
        ]);
        questions = await questionsRes.json();
        types = await typesRes.json();
    } catch (error) {
        console.error("無法載入資料:", error);
        questionArea.innerHTML = "<p>抱歉，載入測驗時發生錯誤，請稍後再試。</p>";
    }
}

function startQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    
    currentUser = 1;
    currentQuestionIndex = 0;
    user1Answers = [];
    user1AnswerIndices = [];
    user2Answers = [];
    user2AnswerIndices = [];
    
    nextBtn.classList.add('hidden');
    submitBtn.classList.add('hidden');
    questionArea.classList.remove('hidden');

    setupProgressTracker();
    displayCurrentQuestion();
}

function setupProgressTracker() {
    progressTracker.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('progress-dot');
        dot.dataset.index = i;
        progressTracker.appendChild(dot);
    }
}

function updateProgressTracker() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        if (index < currentQuestionIndex) {
            dot.classList.add('completed');
            dot.classList.remove('active');
        } else if (index === currentQuestionIndex) {
            dot.classList.add('active');
            dot.classList.remove('completed');
        } else {
            dot.classList.remove('active', 'completed');
        }
    });
}


function displayCurrentQuestion() {
    updateProgressTracker();
    quizTitle.textContent = `使用者 ${currentUser} 的測驗`;
    const q = questions[currentQuestionIndex];
    
    questionArea.innerHTML = `
        <div class="current-question-card animate-in">
            <div class="q-number">Q${currentQuestionIndex + 1}</div>
            <div class="q-text">${q.question}</div>
        </div>
        <div class="single-options-grid animate-in">
            ${q.options.map((opt, i) => `
                <button class="option-btn" data-question-index="${currentQuestionIndex}" data-option-index="${i}">
                    ${opt.text}
                </button>
            `).join('')}
        </div>
    `;

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', handleOptionSelect);
    });
}

function handleOptionSelect(event) {
    const { questionIndex, optionIndex } = event.target.dataset;
    const qIndex = parseInt(questionIndex);
    const oIndex = parseInt(optionIndex);

    const answers = currentUser === 1 ? user1Answers : user2Answers;
    const answerIndices = currentUser === 1 ? user1AnswerIndices : user2AnswerIndices;
    
    answers[qIndex] = questions[qIndex].options[oIndex];
    answerIndices[qIndex] = oIndex;

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayCurrentQuestion();
    } else {
        endUserQuiz();
    }
}

function endUserQuiz() {
    questionArea.classList.add('hidden');
    if (currentUser === 1) {
        nextBtn.classList.remove('hidden');
    } else {
        submitBtn.classList.remove('hidden');
    }
}


function nextUser() {
    currentUser = 2;
    currentQuestionIndex = 0;
    nextBtn.classList.add('hidden');
    questionArea.classList.remove('hidden');
    displayCurrentQuestion();
    window.scrollTo(0, 0);
}

function showResults() {
    const personality1 = calculatePersonality(user1Answers);
    const personality2 = calculatePersonality(user2Answers);
    
    const compatibilityScore = calculateCompatibility(user1AnswerIndices, user2AnswerIndices);
    const compatibilityLevel = getCompatibilityLevel(compatibilityScore);

    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    document.getElementById('match-score').textContent = `${compatibilityScore}%`;
    document.getElementById('match-level').textContent = `${compatibilityLevel.level} - ${compatibilityLevel.metaphor}`;
    document.getElementById('match-advice').textContent = compatibilityLevel.advice;

    displayResultCard('user1-result', 1, personality1);
    displayResultCard('user2-result', 2, personality2);
    window.scrollTo(0, 0);
}

function displayResultCard(elementId, userNum, personalityId) {
    const personality = types.find(t => t.id === personalityId);
    const container = document.getElementById(elementId);
    
    const recommended = personality.recommended_partners
        .map(partnerId => types.find(t => t.id === partnerId).name)
        .join('、');

    container.innerHTML = `
        <h3>使用者 ${userNum} 的人格</h3>
        <img src="${personality.image}" alt="${personality.name}" class="personality-image" onerror="this.style.display='none'">
        <h4>${personality.name}</h4>
        <p>${personality.description}</p>
        <div class="recommended-partners">
            <strong>適合的旅伴人格:</strong>
            <p>${recommended}</p>
        </div>
    `;
}

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextUser);
submitBtn.addEventListener('click', showResults);
restartBtn.addEventListener('click', startQuiz);

// Initial Load
loadData(); 