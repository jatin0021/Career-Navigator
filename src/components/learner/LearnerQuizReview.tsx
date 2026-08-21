import React from "react";
import { Check, X } from "lucide-react";
import { LearnerProgressBadge } from "./LearnerProgressBadge";
import type { QuizQuestion } from "./learnerQuizData";

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface LearnerQuizReviewProps {
  questions: QuizQuestion[];
  userAnswers: QuizAnswer[];
  score: number;
  onBackToSummary: () => void;
}

export function LearnerQuizReview({
  questions,
  userAnswers,
  score,
  onBackToSummary,
}: LearnerQuizReviewProps) {
  const cardClassName =
    "w-full max-w-[640px] rounded-2xl border border-[#E2E8F0] bg-white p-3 sm:p-6 box-border overflow-hidden";

  return (
    <section className={cardClassName} aria-labelledby="review-heading">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center gap-3 border-b border-[#E2E8F0] pb-6 text-center">
        <LearnerProgressBadge status="completed" />

        <div className="mt-2 space-y-1">
          <h2
            id="review-heading"
            className="text-xl font-semibold text-[#0F172A] sm:text-2xl"
          >
            Quiz Results
          </h2>

          <p className="text-base text-[#475569]">
            You scored <span className="font-semibold text-[#0F172A]">{score}</span> out of{" "}
            {questions.length}
          </p>
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-6 sm:space-y-8">
        {questions.map((q, index) => {
          const userAnswer = userAnswers.find((a) => a.questionId === q.id);
          const isUserCorrect = userAnswer?.isCorrect ?? false;

          return (
            <div
              key={q.id}
              className="space-y-3.5 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] p-3.5 sm:p-5"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Question {index + 1} of {questions.length}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-[#0F172A] sm:text-lg">
                    {q.question}
                  </h3>
                </div>

                {/* Question Result Badge */}
                {isUserCorrect ? (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 text-xs font-semibold text-[#166534]">
                    <Check size={13} strokeWidth={2.5} />
                    Correct
                  </span>
                ) : (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1 text-xs font-semibold text-[#991B1B]">
                    <X size={13} strokeWidth={2.5} />
                    Incorrect
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((option) => {
                  const isSelected = userAnswer?.selectedAnswer === option;
                  const isCorrect = q.correctAnswer === option;

                  let containerStyle =
                    "border-[#E2E8F0] bg-white text-[#64748B] opacity-75";
                  let badge = null;

                  if (isSelected && isCorrect) {
                    containerStyle =
                      "border-[#86EFAC] bg-[#F0FDF4] text-[#166534] font-medium";
                    badge = (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D]">
                        <Check size={13} strokeWidth={2.5} />
                        Your answer • Correct
                      </span>
                    );
                  } else if (isSelected && !isCorrect) {
                    containerStyle =
                      "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B] font-medium";
                    badge = (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B91C1C]">
                        <X size={13} strokeWidth={2.5} />
                        Your answer
                      </span>
                    );
                  } else if (!isSelected && isCorrect) {
                    containerStyle =
                      "border-[#86EFAC] bg-[#F0FDF4] text-[#166534] font-medium";
                    badge = (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D]">
                        <Check size={13} strokeWidth={2.5} />
                        Correct answer
                      </span>
                    );
                  }

                  return (
                    <div
                      key={option}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border p-3 sm:p-3.5 text-sm sm:text-base transition-colors ${containerStyle}`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <input
                          type="radio"
                          name={`review-q-${q.id}`}
                          checked={isSelected}
                          disabled
                          readOnly
                          aria-disabled="true"
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#4F46E5] pointer-events-none"
                        />
                        <span className="leading-snug break-words">{option}</span>
                      </div>

                      {badge && (
                        <div className="pl-6 sm:pl-0 sm:shrink-0">
                          {badge}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to Summary Footer Button */}
      <div className="mt-8 flex justify-center border-t border-[#E2E8F0] pt-6">
        <button
          type="button"
          onClick={onBackToSummary}
          className="w-full max-w-xs rounded-lg bg-[#4F46E5] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#4338CA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
        >
          Back to Summary
        </button>
      </div>
    </section>
  );
}
