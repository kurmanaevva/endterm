# endterm

Creational Patterns:
Builder: QuizBuilder class helps build a quiz.
Singleton: Leaderboard class ensures a single instance for managing leaderboard data.

Behavioral Patterns:
Iterator: Quiz class allows iteration through questions with next().
Strategy: ScoreStrategy class and its subclasses (BonusScoreStrategy) allow different scoring behaviors.

Structural Patterns:
Facade: QuizFacade simplifies quiz logic interactions.
Composite: QuestionComponent structure allows complex question categories (question groups or categories).


The quiz is limited to a fixed number of questions. It does not allow dynamic generation of quizzes based on the user’s preferences.
The system uses a very basic scoring mechanism. For each correct answer, the user gains 1 point.
The leaderboard only stores a list of top scores. It does not support ranking by other factors, such as time taken to complete the quiz.
