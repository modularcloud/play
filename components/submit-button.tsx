"use client";

import { Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "~/lib/utils";

export type SubmitButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
>;

export function SubmitButton({ className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      className={cn(
        "bg-blue-500 text-white px-2 rounded-md py-1.5 text-sm flex items-center gap-1 justify-center",
        "focus:outline-none focus:ring-2 focus:border-blue-500 ring-blue-500/50",
        className
      )}
      type="submit"
      aria-disabled={pending}
      onClick={(e) => {
        if (pending) {
          e.preventDefault();
        }
      }}
    >
      {pending && <Loader className="h-4 w-4 animate-spin" />}
      <span>{pending ? "Submitting..." : "Submit"}</span>
    </button>
  );
}
