// Load questions
const questionset = JSON.parse(localStorage.getItem('activeQuestions'));
const questionEl = document.getElementById('question'); // <div id="question">
const optionBtns = document.querySelectorAll('.selection'); // your option buttons
const submitBtn = document.getElementById('submit');
const questionCount = questionset.length;
let totalTime = questionCount * 60; // 1min per question
const timerBox = document.querySelector(".timer-box");
let criticalTime = Math.floor(0.25 * questionCount * 60);

if (!questionset) {
    alert("No quiz selected! Please go back and select a set.");
    window.location.href = 'index.html';
}

// State
let currentIndex = 0;
let selectedAnswer = null;

// Timer
function timer() {
    const timerInterval = setInterval(() => {
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
    
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    
        if (totalTime <= criticalTime) {
            timerBox.classList.add("critical");
        }
    
        totalTime--;
        if (totalTime <= 0) {
            clearInterval(timerInterval);
            timeDisplay.textContent = "00:00";
            handleTimeUp();
        }
    }, 900);
}

// Handle Time Up
function handleTimeUp() {
    localStorage.setItem('activeQuestions', JSON.stringify(questionset));
    alert("Time's up!");
    window.location.href = 'review.html';
}

// Display a question
function displayQuestion() {
    const q = questionset[currentIndex];
    questionEl.textContent = q.question;

    optionBtns.forEach((btn, i) => {
        btn.textContent = q.options[i];
        btn.classList.remove('selected');
        btn.onclick = () => {
            selectedAnswer = i;
            submitBtn.disabled = false;

            optionBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        };
    });

    submitBtn.disabled = true;
}

// Handle submit
submitBtn.onclick = () => {
    if (selectedAnswer === null) return;

    questionset[currentIndex].selectedAnswer = selectedAnswer;
    selectedAnswer = null;

    currentIndex++;
    if (currentIndex < questionset.length) {
        displayQuestion();
    } else {
        // Quiz finished
        localStorage.setItem('activeQuestions', JSON.stringify(questionset));
        window.location.href = 'review.html';
    }
};



// Initialize
displayQuestion();
timer();

const endQuiz = document.getElementById("endQuiz");
endQuiz.onclick = () => {
    window.location.href = "index.html";
    localStorage.removeItem('activeQuestions');
};