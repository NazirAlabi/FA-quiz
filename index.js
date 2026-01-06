// Global variable to store which set is selected
let selectedSet = null;

const setBtns = document.querySelectorAll('.question-set-btn');
const startBtn = document.getElementById('startQuiz');

// Import question sets
import { set1 } from './data/set1.js';
import { set2 } from './data/set2.js';
import { set3 } from './data/set3.js';
import { set4 } from './data/set4.js';

const questionSets = [set1, set2, set3, set4];

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Button click to select a set
setBtns.forEach((btn, index) => {
    btn.onclick = () => {
        selectedSet = questionSets[index]; // ✅ store globally
        console.log("Clicked button index:", index); 
        console.log("Selected question set:", selectedSet);

        startBtn.disabled = false;

        setBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    };
});

// Start quiz click
startBtn.onclick = () => {
    if (!selectedSet) return; // safety check
    const questions = structuredClone(selectedSet); // clone to avoid mutation
    shuffle(questions);
    console.log("Shuffled questions ready for quiz:", questions);

    localStorage.setItem('activeQuestions', JSON.stringify(questions));
    window.location.href = 'quiz.html';
};
