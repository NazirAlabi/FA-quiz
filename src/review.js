const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const percentToggle = document.getElementById("percentToggle");
const scoreToggle = document.getElementById("scoreToggle"); 
const reviewBtn = document.getElementById("reviewBtn");
const hideReviewBtn = document.getElementById("hideReviewBtn");
const quizComplete = document.querySelector(".quiz-complete");
const reviewCard = document.querySelector(".review-card");
const tableBody = document.getElementById("tableBody");
const reviewTable = document.getElementById("review-table");

const questions = JSON.parse(localStorage.getItem('activeQuestions'));

localStorage.removeItem('progressSet');

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

//   REVIEW TABLE LOGIC
function createMobileReviewAccordion(questions) {
    const page = document.getElementById("page");
        page.classList.remove("page");
        page.classList.add("mobile-review-page");
    const container = document.getElementById("mobileQuestions");
    container.innerHTML = "";
    container.appendChild(document.createElement("hr"));
    scoreEl.textContent = `${score} of ${totalQuestions} Correct`;
    scoreEl.classList.add("font-bold");
    container.appendChild(scoreEl);

    questions.forEach((q, i) => {
        // ----- status logic -----
        let indicatorClass = "bg-text-unanswered";

        if (q.selectedAnswer === q.answer) {
            indicatorClass = "bg-text-correct";
        } 
        else if (q.selectedAnswer !== null) {
            indicatorClass = "bg-text-incorrect";
        }

        // ----- card -----
        const card = document.createElement("div");
        card.className = "card";

        // ----- label -----
        const label = document.createElement("div");
        label.className = "card-label";
        label.innerHTML = `
            Question ${i + 1}
            <div class="indicator ${indicatorClass}"></div>
        `;

        // ----- content -----
        const content = document.createElement("div");
        content.className = "card-content";
        content.style.display = "none";

        let contentHTML = `
            <p class="question-mobile-review">${q.question}</p>
            <br><hr><br>
            <p class="ans">${q.options[q.answer]}</p>
        `;

        // show wrong answer only if wrong
        if (q.selectedAnswer !== null && q.selectedAnswer !== q.answer) {
            contentHTML += `
                <br><hr><br>
                <p class="sel-ans">${q.options[q.selectedAnswer]}</p>
            `;
        }

        content.innerHTML = contentHTML;

        // ----- accordion toggle -----
        label.onclick = () => {
            const isOpen = content.style.display === "block";

            content.style.display = isOpen ? "none" : "block";
            content.style.maxHeight = isOpen ? "0" : content.scrollHeight + "px";
        };

        card.appendChild(label);
        card.appendChild(content);
        container.appendChild(card);
    });
}

function showReview() {
    if (window.innerWidth > 480) {
        // desktop table
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
                    <td class="p-4">Q${i + 1}. ${q.question}</td>
                    <td class="p-4 text-center ${color}">${status}</td>
                    <td class="p-4">${q.options[q.answer]}</td>
                </tr>
            `;
        }).join("");

        tableBody.innerHTML = rows;
    } 
    else {
        // mobile accordion
        reviewTable.style.display = "none";
        createMobileReviewAccordion(questions);
    }
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