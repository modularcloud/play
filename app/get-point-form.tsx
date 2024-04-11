"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getPoints } from "~/app/actions";

export type GetPointsFormProps = {};

export function GetPointsForm() {
  const [state, formAction] = useFormState(getPoints, null);

  const errors =
    state && "fieldErrors" in state ? state.fieldErrors.email : null;

  if (state && "success" in state) {
    return <>Enjoy your points ! 🥳</>;
  }

  return (
    <form action={formAction}>
      <label htmlFor="email"></label>
      <input type="text" name="email" id="email" required />
      {errors && <span className="text-red-400">{errors}</span>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
