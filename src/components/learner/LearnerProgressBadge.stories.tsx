import type { Meta, StoryObj } from "@storybook/react";
import {
  LearnerProgressBadge,
  type LearnerProgressStatus,
} from "./LearnerProgressBadge";

const meta = {
  title: "Learner/LearnerProgressBadge",
  component: LearnerProgressBadge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    status: {
      control: "radio",
      options: [
        "default",
        "in-progress",
        "completed",
        "disabled",
      ] satisfies LearnerProgressStatus[],
    },
  },
} satisfies Meta<typeof LearnerProgressBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: "default",
  },
};

export const InProgress: Story = {
  args: {
    status: "in-progress",
  },
};

export const Completed: Story = {
  args: {
    status: "completed",
  },
};

export const Disabled: Story = {
  args: {
    status: "disabled",
  },
};