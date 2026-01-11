const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const percentToggle = document.getElementById("percentToggle");
const scoreToggle = document.getElementById("scoreToggle"); 
const reviewBtn = document.getElementById("reviewBtn");
const hideReviewBtn = document.getElementById("hideReviewBtn");
const quizComplete = document.querySelector(".quiz-complete");
const reviewCard = document.querySelector(".review-card");
const tableBody = document.getElementById("tableBody");

const questions = JSON.parse(localStorage.getItem('activeQuestions'));

if (!questions) {
    window.location.href = 'index.html';
}

/* =========================
   SCORE CALCULATION
========================= */

let score = 0;
const totalQuestions = questions.length;

questions.forEach(q => {
    if (q.selectedAnswer === q.answer) {
        score++;
    }
});

scoreEl.textContent = score;
totalEl.textContent = totalQuestions;

/* =========================
   TOGGLE SCORE / PERCENT
========================= */

percentToggle.onclick = () => {
    const percent = Math.round((score / totalQuestions) * 100);
    percentToggle.textContent = `${percent}%`;
    scoreToggle.textContent = "/";
    percentToggle.classList.remove("toggleBtn");
    scoreToggle.classList.add("toggleBtn");
};

scoreToggle.onclick = () => {
    scoreToggle.textContent = `${score}/${totalQuestions}`;
    percentToggle.textContent = "%";
    scoreToggle.classList.remove("toggleBtn");
    percentToggle.classList.add("toggleBtn");
};

/* =========================
   REVIEW TABLE LOGIC
========================= */

function showReview() {
    const rows = questions.map((q, i) => {
        let status = "Wrong";
        let color = "text-red-600";

        if (q.selectedAnswer === null) {
            status = "Not Attempted";
            color = "text-gray-500";
        } 
        else if (q.selectedAnswer === q.answer) {
            status = "Correct";
            color = "text-green-600";
        }

        return `
            <tr class="border-b">
                <td class="p-4">
                    Q${i + 1}. ${q.question}
                </td>
                <td class="p-4 text-center ${color}">
                    ${status}
                </td>
                <td class="p-4">
                    ${q.options[q.answer]}
                </td>
            </tr>
        `;
    }).join("");      
    tableBody.innerHTML = rows;

};

if (window.innerWidth < 480) {
    reviewBtn.style.display = "none"
}

reviewBtn.onclick = () => {
    quizComplete.style.display = "none";
    reviewCard.style.display = "block";
    showReview();

};

hideReviewBtn.onclick = () => {
    quizComplete.style.display = "flex";
    reviewCard.style.display = "none";
}

const endQuiz = document.getElementById("endQuiz");
endQuiz.onclick = () => {
    window.location.href = "index.html";
    localStorage.removeItem('activeQuestions');
};