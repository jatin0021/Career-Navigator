import type { Meta, StoryObj } from "@storybook/react";
import { LearnerQuiz } from "./LearnerQuiz";

const meta = {
  title: "Learner/LearnerQuiz",
  component: LearnerQuiz,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LearnerQuiz>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};