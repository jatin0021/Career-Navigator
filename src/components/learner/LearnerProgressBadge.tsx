import React from "react";
import { Check } from "lucide-react";

export type LearnerProgressStatus =
  | "default"
  | "in-progress"
  | "completed"
  | "disabled";

interface LearnerProgressBadgeProps {
  status: LearnerProgressStatus;
}

const statusConfig = {
  default: {
    label: "Not Started",
    className: "border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B]",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5]",
  },
  completed: {
    label: "Completed",
    className: "border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A]",
  },
  disabled: {
    label: "Disabled",
    className: "border-[#E2E8F0] bg-[#F1F5F9] text-[#94A3B8]",
  },
};

export function LearnerProgressBadge({
  status,
}: LearnerProgressBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`flex justify-center h-[72px] w-full max-w-[320px] items-center gap-[6px] rounded-full border px-[12px] py-[6px] text-[14px] font-medium ${config.className}`}
      aria-disabled={status === "disabled"}
    >
      {status === "completed" ? (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#16A34A] text-white">
          <Check size={11} strokeWidth={3} />
        </span>
      ) : (
        <span className="h-4 w-4 rounded-full border-2 border-current" />
      )}

      <span>{config.label}</span>
    </div>
  );
}