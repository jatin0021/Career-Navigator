import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LearnerQuiz } from "./LearnerQuiz";
import { learnerQuizQuestions } from "./learnerQuizData";

describe("LearnerQuiz", () => {
  it("1. Initial render - renders heading, counter, options, and disabled submit button", () => {
    render(<LearnerQuiz />);

    // Quiz heading "Career Navigator Quiz" is visible
    expect(
      screen.getByRole("heading", { name: /career navigator quiz/i })
    ).toBeInTheDocument();

    // Question counter starts at "1 / 10"
    expect(screen.getByText(`1 / ${learnerQuizQuestions.length}`)).toBeInTheDocument();

    // First question text is visible
    expect(screen.getByText(learnerQuizQuestions[0].question)).toBeInTheDocument();

    // All answer options for the first question are rendered
    learnerQuizQuestions[0].options.forEach((option) => {
      expect(screen.getByLabelText(option)).toBeInTheDocument();
    });

    // Submit Answer button is present and disabled initially
    const submitButton = screen.getByRole("button", { name: /submit answer/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("2. Answer selection - selecting an option checks the radio and enables submit button", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    const firstOption = learnerQuizQuestions[0].options[0];
    const radioOption = screen.getByLabelText(firstOption);
    const submitButton = screen.getByRole("button", { name: /submit answer/i });

    expect(radioOption).not.toBeChecked();
    expect(submitButton).toBeDisabled();

    // Select an answer using userEvent
    await user.click(radioOption);

    // Verify the selected radio is checked
    expect(radioOption).toBeChecked();

    // Verify Submit Answer becomes enabled
    expect(submitButton).toBeEnabled();
  });

  it("3. Empty submission - submit button remains disabled when no option is selected", () => {
    render(<LearnerQuiz />);

    const submitButton = screen.getByRole("button", { name: /submit answer/i });
    expect(submitButton).toBeDisabled();

    // Verify none of the options are checked
    learnerQuizQuestions[0].options.forEach((option) => {
      expect(screen.getByLabelText(option)).not.toBeChecked();
    });
  });

  it("4. Submit answer and next question - submitting advances to question 2 and updates counter", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    const firstOption = learnerQuizQuestions[0].options[0];
    await user.click(screen.getByLabelText(firstOption));

    const submitButton = screen.getByRole("button", { name: /submit answer/i });
    await user.click(submitButton);

    // Verify the second question appears
    expect(screen.getByText(learnerQuizQuestions[1].question)).toBeInTheDocument();

    // Verify counter changes from "1 / 10" to "2 / 10"
    expect(screen.getByText(`2 / ${learnerQuizQuestions.length}`)).toBeInTheDocument();
  });

  it("5. Complete the quiz - submitting all 10 questions displays Quiz Completed screen", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      const optionToSelect = learnerQuizQuestions[i].options[0];
      await user.click(screen.getByLabelText(optionToSelect));

      const isLast = i === learnerQuizQuestions.length - 1;
      const buttonName = isLast ? /finish quiz/i : /submit answer/i;

      await user.click(screen.getByRole("button", { name: buttonName }));
    }

    // Verify final completion screen appears
    expect(
      screen.getByRole("heading", { name: /quiz completed/i })
    ).toBeInTheDocument();
  });

  it("6. Final score - submitting all correct answers yields 10 out of 10 including the 10th answer", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      const q = learnerQuizQuestions[i];
      await user.click(screen.getByLabelText(q.correctAnswer));

      const isLast = i === learnerQuizQuestions.length - 1;
      const buttonName = isLast ? /finish quiz/i : /submit answer/i;

      await user.click(screen.getByRole("button", { name: buttonName }));
    }

    // Verify "You scored 10 out of 10." is displayed
    expect(
      screen.getByText(
        new RegExp(`You scored ${learnerQuizQuestions.length} out of ${learnerQuizQuestions.length}`, "i")
      )
    ).toBeInTheDocument();
  });

  it("7. Analyze Results - shows read-only review mode with submitted and correct answers", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    // Complete quiz with first options
    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      const optionToSelect = learnerQuizQuestions[i].options[0];
      await user.click(screen.getByLabelText(optionToSelect));

      const isLast = i === learnerQuizQuestions.length - 1;
      const buttonName = isLast ? /finish quiz/i : /submit answer/i;

      await user.click(screen.getByRole("button", { name: buttonName }));
    }

    // Click "Analyze Results"
    const analyzeButton = screen.getByRole("button", { name: /analyze results/i });
    await user.click(analyzeButton);

    // Verify review mode appears
    expect(
      screen.getByRole("heading", { name: /quiz results/i })
    ).toBeInTheDocument();

    // Verify submitted answers & correct answers are rendered in read-only mode
    const radioInputs = screen.getAllByRole("radio");
    expect(radioInputs.length).toBe(learnerQuizQuestions.length * 4);
    radioInputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("8. Review mode cannot change answers - radio inputs remain disabled and locked", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    // Complete quiz
    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      await user.click(screen.getByLabelText(learnerQuizQuestions[i].options[0]));
      const isLast = i === learnerQuizQuestions.length - 1;
      await user.click(
        screen.getByRole("button", { name: isLast ? /finish quiz/i : /submit answer/i })
      );
    }

    await user.click(screen.getByRole("button", { name: /analyze results/i }));

    // Find radio inputs in review mode
    const radioInputs = screen.getAllByRole("radio");
    const firstRadio = radioInputs[0];
    const secondRadio = radioInputs[1];

    expect(firstRadio).toBeChecked();
    expect(firstRadio).toBeDisabled();
    expect(secondRadio).not.toBeChecked();

    // Attempting to click another radio option in review mode must not change selection
    await user.click(secondRadio);

    expect(secondRadio).not.toBeChecked();
    expect(firstRadio).toBeChecked();
  });

  it("9. Try Again - resets state, clears previous answers, and returns to question 1", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    // Complete quiz
    for (let i = 0; i < learnerQuizQuestions.length; i++) {
      await user.click(screen.getByLabelText(learnerQuizQuestions[i].options[0]));
      const isLast = i === learnerQuizQuestions.length - 1;
      await user.click(
        screen.getByRole("button", { name: isLast ? /finish quiz/i : /submit answer/i })
      );
    }

    expect(screen.getByRole("heading", { name: /quiz completed/i })).toBeInTheDocument();

    // Click "Try Again"
    await user.click(screen.getByRole("button", { name: /try again/i }));

    // Verify returning to question 1
    expect(
      screen.getByRole("heading", { name: /career navigator quiz/i })
    ).toBeInTheDocument();
    expect(screen.getByText(`1 / ${learnerQuizQuestions.length}`)).toBeInTheDocument();
    expect(screen.getByText(learnerQuizQuestions[0].question)).toBeInTheDocument();

    // Verify options are reset / unchecked
    learnerQuizQuestions[0].options.forEach((option) => {
      expect(screen.getByLabelText(option)).not.toBeChecked();
    });

    expect(screen.getByRole("button", { name: /submit answer/i })).toBeDisabled();
  });

  it("10. Keyboard interaction - quiz can be navigated and submitted using keyboard", async () => {
    const user = userEvent.setup();
    render(<LearnerQuiz />);

    const firstOptionRadio = screen.getByLabelText(learnerQuizQuestions[0].options[0]);

    // Focus radio option and press Space / Arrow keys to select
    firstOptionRadio.focus();
    expect(firstOptionRadio).toHaveFocus();
    await user.keyboard(" ");

    expect(firstOptionRadio).toBeChecked();

    const submitButton = screen.getByRole("button", { name: /submit answer/i });
    expect(submitButton).toBeEnabled();

    // Tab to submit button and press Enter to submit
    await user.tab();
    expect(submitButton).toHaveFocus();
    await user.keyboard("{Enter}");

    // Verify Question 2 is displayed
    expect(screen.getByText(learnerQuizQuestions[1].question)).toBeInTheDocument();
    expect(screen.getByText(`2 / ${learnerQuizQuestions.length}`)).toBeInTheDocument();
  });
});
