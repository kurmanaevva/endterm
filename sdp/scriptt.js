class Quiz {
    constructor(title, questions) {
        this.title = title;
        this.questions = questions.map(q => ({ question: q, answer: "" }));
        this.score = 0;
    }

    setAnswer(questionIndex, answer) {
        this.questions[questionIndex].answer = answer;
    }

    calculateScore() {
        this.score = this.questions.filter(q => q.answer === q.correctAnswer).length;
    }
}

class QuizManager {
    constructor() {
        this.quizzes = [];
        this.scores = [];
    }

    createQuiz(title, questions) {
        const quiz = new Quiz(title, questions);
        this.quizzes.push(quiz);
    }

    submitQuiz(quiz) {
        quiz.calculateScore();
        this.scores.push({ title: quiz.title, score: quiz.score });
        this.updateLeaderboard();
    }

    updateLeaderboard() {
        this.scores.sort((a, b) => b.score - a.score);
        const scoreList = document.getElementById('score-list');
        scoreList.innerHTML = this.scores.map(s => `<li>${s.title}: ${s.score}</li>`).join('');
    }
}

const quizManager = new QuizManager();

document.getElementById('create-quiz').addEventListener('click', () => {
    const title = document.getElementById('quiz-title').value;
    const questionsText = document.getElementById('quiz-questions').value;
    const questions = questionsText.split(',').map(q => ({ question: q.trim(), correctAnswer: "" }));
    
    quizManager.createQuiz(title, questions);
    alert('Quiz created successfully! You can now take it.');
});

document.getElementById('submit-quiz').addEventListener('click', () => {
    const currentQuiz = quizManager.quizzes[0]; // Just an example, assuming first quiz
    quizManager.submitQuiz(currentQuiz);
    
    document.getElementById('score-display').innerText = `Your score: ${currentQuiz.score}`;
    document.getElementById('score-display').style.display = 'block';
    document.getElementById('leaderboard').style.display = 'block';
});

// Example of how to display quiz questions when taking a quiz
function displayQuiz(quiz) {
    document.getElementById('current-quiz-title').innerText = quiz.title;
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = quiz.questions.map((q, index) => `
        <div>
            <label>${q.question}</label>
            <input type="text" onchange="quizManager.quizzes[0].setAnswer(${index}, this.value)" />
        </div>
    `).join('');
    document.getElementById('submit-quiz').style.display = 'block';
}

