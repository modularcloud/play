"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useFormState } from "react-dom";
import { updateSettings } from "~/app/actions";
import { SubmitButton } from "~/components/submit-button";
import { cn } from "~/lib/utils";

export type SettingsFormProps = {
  className?: string;
  onClose?: () => void;
  defaultName: string | null;
};

export function SettingsForm({
  className,
  defaultName,
  onClose
}: SettingsFormProps) {
  const [state, formAction] = useFormState(updateSettings, null);

  const errors =
    state && "fieldErrors" in state ? state.fieldErrors.name : null;

  const isSuccess = Boolean(state && "success" in state);

  return (
    <form
      action={formAction}
      className={cn(
        "bg-white relative rounded-md border border-muted/20 p-3.5 flex flex-col gap-3 max-w-64",
        className
      )}
    >
      <label htmlFor="name" className="text-sm font-medium">
        Your name
      </label>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full absolute top-2 right-2 p-0.5"
      >
        <span className="sr-only">close form</span>
        <X className="h-3 w-3" />
      </button>

      <input
        type="text"
        name="name"
        id="name"
        autoFocus
        required
        defaultValue={defaultName ?? ""}
        placeholder="John doe"
        aria-describedby="name-error"
        aria-invalid={!!errors}
        className={cn(
          "border rounded-md px-2 py-1.5",
          "focus:outline-none focus:ring-2 focus:border-blue-500 ring-blue-500/50",
          errors && "focus:border-red-500 ring-red-500/50"
        )}
      />

      {errors && (
        <small
          id="name-error"
          aria-live="polite"
          className="text-red-400 text-sm"
        >
          {errors}
        </small>
      )}
      {isSuccess && (
        <small className="text-teal-500">Name updated successfully.</small>
      )}
      <SubmitButton className="self-strech" />
    </form>
  );
}
