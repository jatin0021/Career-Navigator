export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const learnerQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which skill is most important for effective communication?",
    options: [
      "Active listening",
      "Ignoring feedback",
      "Speaking as quickly as possible",
      "Avoiding questions",
    ],
    correctAnswer: "Active listening",
  },
  {
    id: 2,
    question: "What is the main purpose of a resume?",
    options: [
      "To list every activity you have ever done",
      "To highlight relevant skills and experience",
      "To replace a job interview",
      "To describe your personal hobbies only",
    ],
    correctAnswer: "To highlight relevant skills and experience",
  },
  {
    id: 3,
    question: "Which approach is best when preparing for a job interview?",
    options: [
      "Avoid researching the company",
      "Memorize every possible answer",
      "Research the company and practice common questions",
      "Arrive without preparing",
    ],
    correctAnswer: "Research the company and practice common questions",
  },
  {
    id: 4,
    question: "What does networking help you do?",
    options: [
      "Build professional relationships",
      "Avoid learning new skills",
      "Guarantee a job immediately",
      "Replace your resume",
    ],
    correctAnswer: "Build professional relationships",
  },
  {
    id: 5,
    question: "Which is an example of a transferable skill?",
    options: [
      "Communication",
      "A specific company password",
      "One particular office location",
      "A temporary access code",
    ],
    correctAnswer: "Communication",
  },
  {
    id: 6,
    question: "Why is setting career goals useful?",
    options: [
      "It removes the need to learn",
      "It provides direction and helps track progress",
      "It guarantees success",
      "It prevents career changes",
    ],
    correctAnswer: "It provides direction and helps track progress",
  },
  {
    id: 7,
    question: "What should you do if you do not know the answer during an interview?",
    options: [
      "Make up information",
      "Ignore the interviewer",
      "Be honest and explain how you would find the answer",
      "Leave the interview",
    ],
    correctAnswer:
      "Be honest and explain how you would find the answer",
  },
  {
    id: 8,
    question: "Which practice can improve your professional skills?",
    options: [
      "Avoiding feedback",
      "Regular learning and practice",
      "Never trying new tasks",
      "Ignoring mistakes",
    ],
    correctAnswer: "Regular learning and practice",
  },
  {
    id: 9,
    question: "What is a good way to handle constructive feedback?",
    options: [
      "Ignore it",
      "Take it personally",
      "Listen, understand it, and use it to improve",
      "Avoid the person giving feedback",
    ],
    correctAnswer:
      "Listen, understand it, and use it to improve",
  },
  {
    id: 10,
    question: "What is one benefit of creating a career development plan?",
    options: [
      "It helps identify goals and actions for career growth",
      "It guarantees a promotion",
      "It eliminates all career challenges",
      "It prevents learning new skills",
    ],
    correctAnswer:
      "It helps identify goals and actions for career growth",
  },
];