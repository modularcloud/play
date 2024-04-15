"use client";

import * as React from "react";

import { X } from "lucide-react";
import { useFormState } from "react-dom";
import { getPoints } from "~/app/actions";
import { SubmitButton } from "~/components/submit-button";
import { cn } from "~/lib/utils";

export type GetPointsFormProps = { className?: string; onClose?: () => void };

export function GetPointsForm({ className, onClose }: GetPointsFormProps) {
  const [state, formAction] = useFormState(getPoints, null);

  const errors =
    state && "fieldErrors" in state ? state.fieldErrors.email : null;

  const isSuccess = Boolean(state && "success" in state);

  React.useEffect(() => {
    if (isSuccess) {
      const timeoutID = setTimeout(() => {
        onClose?.();
      }, 1000);
      return () => clearTimeout(timeoutID);
    }
  }, [isSuccess, onClose]);

  return (
    <div
      className={cn(
        "bg-white relative rounded-md border border-muted/20 p-3.5 max-w-64",
        className
      )}
    >
      {isSuccess ? (
        <p className="font-medium pr-4">Enjoy your points ! 🥳</p>
      ) : (
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full absolute top-2 right-2 p-0.5"
          >
            <span className="sr-only">close form</span>
            <X className="h-3 w-3" />
          </button>
          <form action={formAction} className="flex flex-col gap-3">
            <label htmlFor="email" className="text-sm font-medium">
              Add your email to get points
            </label>
            <input
              type="text"
              name="email"
              autoFocus
              id="email"
              required
              placeholder="Enter email"
              aria-describedby="email-error"
              aria-invalid={!!errors}
              className={cn(
                "border rounded-md px-2 py-1.5",
                "focus:outline-none focus:ring-2 focus:border-blue-500 ring-blue-500/50",
                errors && "focus:border-red-500 ring-red-500/50"
              )}
            />
            {errors && (
              <span
                id="email-error"
                aria-live="polite"
                className="text-red-400"
              >
                {errors}
              </span>
            )}
            <SubmitButton />
          </form>
        </>
      )}
    </div>
  );
}
