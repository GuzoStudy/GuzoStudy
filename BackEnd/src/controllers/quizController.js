import Quiz from '../models/Quiz.js';
import QuizResult from '../models/QuizSubmission.js';

// ✅ Create quiz (Instructor/Admin)
export const createQuiz = async (req, res) => {
  try {
    const { title, course, questions } = req.body;
    if (!title || !course || !questions || questions.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const totalMarks = questions.length; // 1 mark per question

    const quiz = new Quiz({
      title,
      course,
      questions,
      createdBy: req.user.id,
      totalMarks,
    });
    await quiz.save();

    res.status(201).json({ message: "Quiz created", quiz });
  } catch (err) {
    console.error("Create Quiz Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all quizzes for a course
export const getQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ course: courseId }).select('-questions.correctOption');
    res.json(quizzes);
  } catch (err) {
    console.error("Get Quizzes Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single quiz (with questions)
export const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).select('-questions.correctOption'); // hide correct answers
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    console.error("Get Quiz Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Submit quiz
export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q) => {
      const userAnswer = answers.find(a => a.questionId === q._id.toString());
      if (userAnswer && userAnswer.selectedOption === q.correctOption) score += 1;
    });

    const result = new QuizResult({
      quiz: quizId,
      user: req.user.id,
      answers,
      score,
    });
    await result.save();

    res.json({ message: "Quiz submitted", score, totalMarks: quiz.totalMarks });
  } catch (err) {
    console.error("Submit Quiz Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user's quiz results
export const getUserResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user.id }).populate('quiz', 'title course');
    res.json(results);
  } catch (err) {
    console.error("Get Results Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
