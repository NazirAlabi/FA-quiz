let timerInterval = null;
const notifyDiv = document.getElementById('notifyDiv')
const questionset = JSON.parse(localStorage.getItem('activeQuestions'));
const questionEl = document.getElementById('question');
const questionNum = document.getElementById('questionNum');
const optionBtns = document.querySelectorAll('.selection');
const submitBtn = document.getElementById('submit');
const skipBtn = document.getElementById('skip');
const prevBtn = document.getElementById('prev');

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

let progressSet = JSON.parse (localStorage.getItem('progressSet'));
if (!progressSet) {
    progressSet = {
        time: null ,
        questionIndex: 0 
    }
    localStorage.setItem('progressSet', JSON.stringify(progressSet))
}
console.log(progressSet);

function saveprogress(timeleft, questionNum) {
    progressSet.time = timeleft;
    progressSet.questionIndex = questionNum;
    localStorage.setItem('progressSet', JSON.stringify(progressSet))
}


// if (visualViewport) {
//     notify("Quiz Started!");
// }

// State
let currentIndex = progressSet.questionIndex;
let selectedAnswer = null;

// Timer
function timer() {
    if (typeof progressSet.time === "number" && progressSet.time > 0) {
        totalTime = progressSet.time;
    }
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
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
    }, 1000);
}

// Handle Time Up
function handleTimeUp() {
    // notify("Time's up!")
    window.location.href = 'review.html';
    localStorage.removeItem('progressSet');
}

async function notify(str) {
    notifyDiv.innerText = str
}

// Display a question
function displayQuestion() {
    const q = questionset[currentIndex];

    questionNum.textContent = `Q${currentIndex + 1}.`;
    questionEl.textContent = q.question;

    optionBtns.forEach(b => b.classList.remove('selected'));
    selectedAnswer = null;
    submitBtn.disabled = true;

    optionBtns.forEach((btn, i) => {
        btn.textContent = q.options[i];

        btn.onclick = () => {
            selectedAnswer = i;
            optionBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            submitBtn.disabled = false;
        };
    });

    if (q.selectedAnswer !== null && q.selectedAnswer !== undefined) {
        selectedAnswer = q.selectedAnswer;
        optionBtns[selectedAnswer].classList.add('selected');
        submitBtn.disabled = false;
    }

    prevBtn.disabled = currentIndex === 0;
}


// Handle submit
submitBtn.addEventListener('click', () => {
    if (selectedAnswer === null) return;
    
    questionset[currentIndex].selectedAnswer = selectedAnswer;
    localStorage.setItem('activeQuestions', JSON.stringify(questionset));
    optionBtns.forEach(b => b.classList.remove('selected'));

    currentIndex++;
    saveprogress(totalTime, currentIndex);
    if (currentIndex < questionset.length) {
        displayQuestion();
    } else {
        // Quiz finished
        localStorage.setItem('activeQuestions', JSON.stringify(questionset));
        window.location.href = 'review.html';
        localStorage.removeItem('progressSet');

    }
});

skipBtn.onclick = () => {
    if (questionset[currentIndex].selectedAnswer === undefined) {
        questionset[currentIndex].selectedAnswer = null;
    }

    currentIndex++;
    saveprogress(totalTime, currentIndex);

    if (currentIndex < questionset.length) {
        displayQuestion();
    } else {
        localStorage.removeItem('progressSet');
        window.location.href = 'review.html';
    }
};


prevBtn.onclick = () => {
    currentIndex--;
    saveprogress(totalTime, currentIndex);
    displayQuestion();
};

document.addEventListener("keydown", (e) => {
    if (
        (e.key === "Enter" || e.key === "NumpadEnter" || e.key === "ArrowRight") &&
        document.activeElement === document.body
    ) {
        submitBtn.click();
    }
});



// Initialize
displayQuestion();
timer();

const endQuiz = document.getElementById("endQuiz");
endQuiz.onclick = () => {
    window.location.href = "index.html";
    localStorage.removeItem('activeQuestions');
    localStorage.removeItem('progressSet');

};