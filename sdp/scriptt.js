class QuizManager {
    constructor() {
        if (QuizManager.instance) {
            return QuizManager.instance;
        }
        this.quizzes = [];
        this.scores = [];
        this.leaderboardObservers = [];
        QuizManager.instance = this;
    }

    static getInstance() {
        if (!QuizManager.instance) {
            QuizManager.instance = new QuizManager();
        }
        return QuizManager.instance;
    }

    addQuiz(quiz) {
        this.quizzes.push(quiz);
    }

    submitQuiz(quiz) {
        quiz.calculateScore();
        this.scores.push({ title: quiz.title, score: quiz.score });
        this.updateLeaderboard();
    }

    updateLeaderboard() {
        this.scores.sort((a, b) => b.score - a.score);
        this.notifyLeaderboardObservers();
    }

    addLeaderboardObserver(observer) {
        this.leaderboardObservers.push(observer);
    }

    notifyLeaderboardObservers() {
        this.leaderboardObservers.forEach(observer => observer.update(this.scores));
    }
}

class QuizFactory {
    createQuiz(type, title, questions) {
        if (type === 'multipleChoice') {
            return new MultipleChoiceQuiz(title, questions);
        } else if (type === 'trueFalse') {
            return new TrueFalseQuiz(title, questions);
        } else {
            throw new Error('Unknown quiz type');
        }
    }
}

class Quiz {
    constructor(title, questions) {
        this.title = title;
        this.questions = questions;
        this.score = 0;
    }

    setAnswer(questionIndex, answer) {
        this.questions[questionIndex].answer = answer;
    }

    calculateScore() {
        this.score = this.questions.filter(q => q.answer === q.correctAnswer).length;
    }
}

class MultipleChoiceQuiz extends Quiz {
    constructor(title, questions) {
        super(title, questions);
    }
}

class TrueFalseQuiz extends Quiz {
    constructor(title, questions) {
        super(title, questions);
    }
}

class TimedQuizDecorator {
    constructor(quiz, timeLimit) {
        this.quiz = quiz;
        this.timeLimit = timeLimit;
        this.startTime = Date.now();
    }

    isTimeUp() {
        return (Date.now() - this.startTime) > this.timeLimit;
    }

    calculateScore() {
        if (!this.isTimeUp()) {
            this.quiz.calculateScore();
        } else {
            this.quiz.score = 0; // No score if time is up
        }
    }
}

class QuizFacade {
    constructor() {
        this.quizManager = QuizManager.getInstance();
        this.quizFactory = new QuizFactory();
    }

    createQuiz(type, title, questions) {
        const quiz = this.quizFactory.createQuiz(type, title, questions);
        this.quizManager.addQuiz(quiz);
        return quiz;
    }

    takeQuiz(quiz) {
        // Logic to take quiz, e.g., render questions
        console.log(`Taking quiz: ${quiz.title}`);
    }

    submitQuiz(quiz) {
        this.quizManager.submitQuiz(quiz);
    }
}

class ScoringStrategy {
    calculate(quiz) {
        throw "Strategy must implement calculate method";
    }
}

class SimpleScoringStrategy extends ScoringStrategy {
    calculate(quiz) {
        quiz.calculateScore(); // Default score calculation
    }
}

class WeightedScoringStrategy extends ScoringStrategy {
    calculate(quiz) {
        quiz.score = quiz.questions.reduce((total, q) => total + (q.isCorrect ? q.weight : 0), 0);
    }
}

class Leaderboard {
    update(scores) {
        const scoreList = document.getElementById('score-list');
        scoreList.innerHTML = scores.map(s => `<li>${s.title}: ${s.score}</li>`).join('');
    }
}

const quizFacade = new QuizFacade();
const leaderboard = new Leaderboard();
const quizManager = QuizManager.getInstance();
quizManager.addLeaderboardObserver(leaderboard);

document.getElementById('create-quiz').addEventListener('click', () => {
    const title = document.getElementById('quiz-title').value;
    const questionsText = document.getElementById('quiz-questions').value;
    const questions = questionsText.split(',').map(q => ({ question: q.trim(), correctAnswer: "" }));
    const quiz = quizFacade.createQuiz('multipleChoice', title, questions);
    alert('Quiz created successfully!');
});

document.getElementById('submit-quiz').addEventListener('click', () => {
    const currentQuiz = quizManager.quizzes[0]; // Example: Taking the first quiz
    quizFacade.submitQuiz(currentQuiz);
    document.getElementById('score-display').innerText = `Your score: ${currentQuiz.score}`;
});
