import { useState } from "react";
import { LearnerProgressBadge } from "./LearnerProgressBadge";
import { learnerQuizQuestions } from "./learnerQuizData";
import { LearnerQuizReview, type QuizAnswer } from "./LearnerQuizReview";

export function LearnerQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [userAnswers, setUserAnswers] = useState<QuizAnswer[]>([]);
  const [viewMode, setViewMode] = useState<"quiz" | "summary" | "review">(
    "quiz"
  );
  const [isInfoSubmitted, setIsInfoSubmitted] = useState(false);
  const [learnerName, setLearnerName] = useState("");
  const [learnerEmail, setLearnerEmail] = useState("");
  const [formError, setFormError] = useState("");

  const currentQuestion = learnerQuizQuestions[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === learnerQuizQuestions.length - 1;
  const score = userAnswers.filter((a) => a.isCorrect).length;

  const handleInfoSubmit = () => {
    if (!learnerName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!learnerEmail.trim()) {
      setFormError("Please enter your email address.");
      return;
    }
    setFormError("");
    setIsInfoSubmitted(true);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      setFeedback("Please select an answer before submitting.");
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };

    const nextAnswers = [...userAnswers, newAnswer];
    setUserAnswers(nextAnswers);

    if (isCorrect) {
      setFeedback("Correct! Well done.");
    } else {
      setFeedback(
        `Incorrect. The correct answer is "${currentQuestion.correctAnswer}".`,
      );
    }

    if (isLastQuestion) {
      setViewMode("summary");
      return;
    }

    setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
    setSelectedAnswer("");
    setFeedback("");
  };

  /*
   * IMPORTANT:
   * This class is intentionally shared by both the quiz
   * and completed state so every screen has the same width.
   */
  const cardClassName =
    "w-full max-w-[640px] rounded-2xl border border-[#E2E8F0] bg-white p-3 sm:p-6 box-border overflow-hidden";

  if (!isInfoSubmitted) {
    return (
      <section
        className={cardClassName}
        aria-labelledby="learner-info-heading"
      >
        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col items-center gap-3 text-center">
            <LearnerProgressBadge status="default" />
            <h1
              id="learner-info-heading"
              className="text-xl font-semibold text-[#0F172A] sm:text-2xl"
            >
              Learner Information
            </h1>
            <p className="text-sm text-[#64748B]">
              Please enter your details to start the Career Navigator Quiz.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleInfoSubmit();
            }}
            className="flex flex-col gap-4 mt-2"
          >
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="learner-name"
                className="text-sm font-medium text-[#334155]"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="learner-name"
                name="name"
                type="text"
                autoComplete="name"
                value={learnerName}
                onChange={(event) => {
                  setLearnerName(event.target.value);
                  setFormError("");
                }}
                placeholder="e.g. Jane Doe"
                className="rounded-lg border border-[#CBD5E1] px-4 py-2.5 text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="learner-email"
                className="text-sm font-medium text-[#334155]"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="learner-email"
                name="email"
                type="email"
                autoComplete="email"
                value={learnerEmail}
                onChange={(event) => {
                  setLearnerEmail(event.target.value);
                  setFormError("");
                }}
                placeholder="e.g. jane@example.com"
                className="rounded-lg border border-[#CBD5E1] px-4 py-2.5 text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
              />
            </div>

            {formError && (
              <div
                className="text-sm font-medium text-red-600"
                role="alert"
                aria-live="polite"
              >
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#4F46E5] px-5 py-3 text-base font-medium text-white transition-colors hover:bg-[#4338CA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
            >
              Start Quiz
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (viewMode === "review") {
    return (
      <LearnerQuizReview
        questions={learnerQuizQuestions}
        userAnswers={userAnswers}
        score={score}
        onBackToSummary={() => setViewMode("summary")}
      />
    );
  }

  if (viewMode === "summary") {
    return (
      <section
        className={`${cardClassName} flex items-center justify-center`}
        aria-labelledby="quiz-complete-heading"
      >
        <div className="flex w-full flex-col items-center justify-center gap-5 py-4 text-center">
          <LearnerProgressBadge status="completed" />

          <div className="space-y-2">
            <h2
              id="quiz-complete-heading"
              className="text-xl font-semibold text-[#0F172A] sm:text-2xl"
            >
              Quiz Completed
            </h2>

            <p className="text-base text-[#475569]">
              You scored {score} out of {learnerQuizQuestions.length}.
            </p>
          </div>

          <div className="flex w-full max-w-xs flex-col gap-3">
            <button
              type="button"
              onClick={() => setViewMode("review")}
              className="w-full rounded-lg bg-[#4F46E5] px-6 py-3 text-base font-medium text-white
                transition-colors
                hover:bg-[#4338CA]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#4F46E5]
                focus-visible:ring-offset-2"
            >
              Analyze Results
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cardClassName}
      aria-labelledby="quiz-heading"
    >
      <div className="flex flex-col">
        {/* Progress */}
        <div className="mb-4">
          <LearnerProgressBadge status="in-progress" />

          <div className="mt-4 flex items-center justify-between gap-3">
            <h1
              id="quiz-heading"
              className="text-base font-semibold text-[#0F172A] sm:text-xl truncate min-w-0"
            >
              Career Navigator Quiz
            </h1>

            <span className="shrink-0 text-sm font-medium text-[#64748B]">
              {currentQuestionIndex + 1} / {learnerQuizQuestions.length}
            </span>
          </div>
        </div>

        {/* Quiz */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <fieldset className="flex flex-col">
            <legend className="mb-4 text-base font-medium leading-6 text-[#0F172A] sm:text-lg">
              {currentQuestion.question}
            </legend>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, index) => {
                const optionId = `question-${currentQuestion.id}-option-${index}`;

                return (
                  <label
                    key={option}
                    htmlFor={optionId}
                    className="flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E2E8F0] p-3.5
                      text-base text-[#334155]
                      transition-colors
                      hover:bg-[#F8FAFC]
                      has-[:checked]:border-[#4F46E5]
                      has-[:checked]:bg-[#EEF2FF]
                      has-[:focus-visible]:border-[#4F46E5]
                      has-[:focus-visible]:ring-2
                      has-[:focus-visible]:ring-[#4F46E5]
                      has-[:focus-visible]:ring-offset-2"
                  >
                    <input
                      id={optionId}
                      name={`question-${currentQuestion.id}`}
                      type="radio"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(event) => {
                        setSelectedAnswer(event.target.value);
                        setFeedback("");
                      }}
                      className="h-4 w-4 shrink-0 accent-[#4F46E5]"
                    />

                    <span className="leading-snug">{option}</span>
                  </label>
                );
              })}
            </div>

            {/* Feedback */}
            <div
              className="mt-3 flex min-h-[44px] items-center text-sm font-medium text-[#475569]"
              aria-live="polite"
              aria-atomic="true"
            >
              {feedback}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!selectedAnswer}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-[#4F46E5] px-5 py-3 text-base font-medium text-white
                transition-colors
                hover:bg-[#4338CA]
                disabled:cursor-not-allowed
                disabled:opacity-50
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#4F46E5]
                focus-visible:ring-offset-2"
            >
              {isLastQuestion ? "Finish Quiz" : "Submit Answer"}
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  );
}