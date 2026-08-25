import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LearnerQuiz } from "./LearnerQuiz";
import { learnerQuizQuestions } from "./learnerQuizData";

describe("LearnerQuiz", () => {
  const submitInfoForm = async (
    user: ReturnType<typeof userEvent.setup>,
    name = "Jane Doe",
    email = "jane@example.com"
  ) => {
    await user.type(screen.getByLabelText(/full name/i), name);
    await user.type(screen.getByLabelText(/email address/i), email);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));
  };

  it("1. User information form is shown before the quiz starts", () => {
    render(<LearnerQuiz />);

    // Learner Information heading and form fields are visible
    expect(
      screen.getByRole("heading", { name: /learner information/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute("autocomplete", "email");
    expect(
      screen.getByRole("button", { name: /start quiz/i })
    ).toBeInTheDocument();
  });

  it("2. Quiz questions are NOT visible before the form is submitted", () => {
    render(<LearnerQuiz />);

    // Quiz title and first question must not be rendered yet
    expect(
      screen.queryByRole("heading", { name: /career navigator quiz/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(learnerQuizQuestions[0].question)
    ).not.toBeInTheDocument();
  });

  it("3. Required form validation works when starting the quiz", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    const startButton = screen.getByRole("button", { name: /start quiz/i });

    // Submit empty form -> shows validation error for name
    await user.click(startButton);
    expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /career navigator quiz/i })
    ).not.toBeInTheDocument();

    // Type name only -> shows validation error for email
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.click(startButton);
    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /career navigator quiz/i })
    ).not.toBeInTheDocument();
  });

  it("4. Submitting valid user information starts the quiz", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    await submitInfoForm(user, "Jane Doe", "jane@example.com");

    // Quiz starts and Question 1 appears
    expect(
      screen.getByRole("heading", { name: /career navigator quiz/i })
    ).toBeInTheDocument();
    expect(screen.getByText(`1 / ${learnerQuizQuestions.length}`)).toBeInTheDocument();
    expect(screen.getByText(learnerQuizQuestions[0].question)).toBeInTheDocument();
  });

  it("5. Personal information is NOT written to browser console", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const user = userEvent.setup();
    render(<LearnerQuiz />);

    const sensitiveName = "Secret Student Name";
    const sensitiveEmail = "secret.email@domain.com";

    await submitInfoForm(user, sensitiveName, sensitiveEmail);

    // Complete quiz
    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      await user.click(screen.getByLabelText(learnerQuizQuestions[i].options[0]));
      const isLast = i === learnerQuizQuestions.length - 1;
      await user.click(
        screen.getByRole("button", { name: isLast ? /finish quiz/i : /submit answer/i })
      );
    }

    await user.click(screen.getByRole("button", { name: /analyze results/i }));

    const allCalls = [
      ...logSpy.mock.calls,
      ...warnSpy.mock.calls,
      ...errorSpy.mock.calls,
    ].flat();

    allCalls.forEach((arg) => {
      const stringified = typeof arg === "object" ? JSON.stringify(arg) : String(arg);
      expect(stringified).not.toContain(sensitiveName);
      expect(stringified).not.toContain(sensitiveEmail);
    });

    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("6. The completed screen does NOT contain 'Try Again'", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    await submitInfoForm(user);

    // Complete all 10 questions
    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      await user.click(screen.getByLabelText(learnerQuizQuestions[i].options[0]));
      const isLast = i === learnerQuizQuestions.length - 1;
      await user.click(
        screen.getByRole("button", { name: isLast ? /finish quiz/i : /submit answer/i })
      );
    }

    expect(screen.getByRole("heading", { name: /quiz completed/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /analyze results/i })).toBeInTheDocument();
  });

  it("7. Analyze Results is still available after completion", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    await submitInfoForm(user);

    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      await user.click(screen.getByLabelText(learnerQuizQuestions[i].options[0]));
      const isLast = i === learnerQuizQuestions.length - 1;
      await user.click(
        screen.getByRole("button", { name: isLast ? /finish quiz/i : /submit answer/i })
      );
    }

    const analyzeButton = screen.getByRole("button", { name: /analyze results/i });
    expect(analyzeButton).toBeInTheDocument();
    expect(analyzeButton).toBeEnabled();
  });

  it("8. Analyze Results opens the read-only quiz review mode", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    await submitInfoForm(user);

    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      await user.click(screen.getByLabelText(learnerQuizQuestions[i].options[0]));
      const isLast = i === learnerQuizQuestions.length - 1;
      await user.click(
        screen.getByRole("button", { name: isLast ? /finish quiz/i : /submit answer/i })
      );
    }

    await user.click(screen.getByRole("button", { name: /analyze results/i }));

    expect(screen.getByRole("heading", { name: /quiz results/i })).toBeInTheDocument();

    const radioInputs = screen.getAllByRole("radio");
    expect(radioInputs.length).toBe(learnerQuizQuestions.length * 4);

    // Verify all radio options are disabled/read-only
    radioInputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("9. Existing keyboard accessibility behavior continues to work", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    const nameInput = screen.getByLabelText(/full name/i);
    nameInput.focus();
    await user.keyboard("Alex Smith");

    await user.tab();
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveFocus();
    await user.keyboard("alex@example.com");

    await user.tab();
    const startButton = screen.getByRole("button", { name: /start quiz/i });
    expect(startButton).toHaveFocus();
    await user.keyboard("{Enter}");

    // Quiz starts
    expect(screen.getByRole("heading", { name: /career navigator quiz/i })).toBeInTheDocument();

    const firstRadio = screen.getByLabelText(learnerQuizQuestions[0].options[0]);
    firstRadio.focus();
    expect(firstRadio).toHaveFocus();
    await user.keyboard(" ");

    expect(firstRadio).toBeChecked();

    await user.tab();
    const submitButton = screen.getByRole("button", { name: /submit answer/i });
    expect(submitButton).toHaveFocus();
    await user.keyboard("{Enter}");

    // Question 2 loaded
    expect(screen.getByText(learnerQuizQuestions[1].question)).toBeInTheDocument();
  });

  it("10. Answer validation and scoring continue to work (10 out of 10)", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    await submitInfoForm(user);

    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      const q = learnerQuizQuestions[i];
      await user.click(screen.getByLabelText(q.correctAnswer));
      const isLast = i === learnerQuizQuestions.length - 1;
      await user.click(
        screen.getByRole("button", { name: isLast ? /finish quiz/i : /submit answer/i })
      );
    }

    expect(
      screen.getByText(
        new RegExp(`You scored ${learnerQuizQuestions.length} out of ${learnerQuizQuestions.length}`, "i")
      )
    ).toBeInTheDocument();
  });
});
