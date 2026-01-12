// Load questions
const notifyDiv = document.getElementById('notifyDiv')
const questionset = JSON.parse(localStorage.getItem('activeQuestions'));
const questionEl = document.getElementById('question');
const questionNum = document.getElementById('questionNum');
const optionBtns = document.querySelectorAll('.selection');
const submitBtn = document.getElementById('submit');
const questionCount = questionset.length;
let timePerQuestion = 30 ; // seconds per question
let totalTime = questionCount * timePerQuestion; // 1min per question
const timerBox = document.querySelector(".timer-box");
const timeDisplay = document.getElementById('time')
let criticalTime = Math.floor(0.25 * questionCount * timePerQuestion);

if (!questionset) {
    alert("No quiz selected! Please go back and select a set.");
    window.location.href = 'index.html';
}

// if (visualViewport) {
//     notify("Quiz Started!");
// }

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
    // notify("Time's up!")
    window.location.href = 'review.html';
}

async function notify(str) {
    notifyDiv.innerText = str
}

// Display a question
function displayQuestion() {
    const q = questionset[currentIndex];
    questionNum.textContent = ` Q${currentIndex + 1}.`;
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
    optionBtns.forEach(b => b.classList.remove('selected'));

    currentIndex++;
    if (currentIndex < questionset.length) {
        displayQuestion();
    } else {
        // Quiz finished
        localStorage.setItem('activeQuestions', JSON.stringify(questionset));
        window.location.href = 'review.html';
    }
};

document.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === "NumpadEnter" || e.key === "ArrowRight") submitBtn.click();
};


// Initialize
displayQuestion();
timer();

const endQuiz = document.getElementById("endQuiz");
endQuiz.onclick = () => {
    window.location.href = "index.html";
    localStorage.removeItem('activeQuestions');
};