"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { createReply } from "~/app/actions";
import { SubmitButton } from "~/components/submit-button";

export type CreateReplyFormProps = {
  parentId: number;
};

export function CreateReplyForm({ parentId }: CreateReplyFormProps) {
  const [state, formAction] = useFormState(createReply, null);

  const errors =
    state && "fieldErrors" in state ? state.fieldErrors.contents : null;

  const formRef = React.useRef<React.ElementRef<"form">>(null);

  React.useEffect(() => {
    if (state && "success" in state) {
      formRef.current?.reset();
    }
  }, [state]);
  return (
    <form ref={formRef} action={formAction} className="relative">
      <div className="w-full  flex flex-col gap-2 border rounded-md border-muted/20 p-2 focus-within:ring-2 ring-blue-500/50 focus-within:border-blue-500">
        <input type="hidden" name="parentId" defaultValue={parentId} readOnly />

        <textarea
          name="contents"
          id="contents"
          className="w-full focus:outline-none"
          rows={2}
          placeholder="Add a reply"
          required
        />

        <div className="h-10 text-left pr-20 flex items-center">
          {errors && <p className="text-red-500">{errors}</p>}
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
