"use client";
import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createPost } from "~/app/actions";
import { SubmitButton } from "~/components/submit-button";

export type CreatePostFormProps = {};

export function CreatePostForm({}: CreatePostFormProps) {
  const [state, formAction] = useFormState(createPost, null);

  const errors =
    state && "fieldErrors" in state ? state.fieldErrors.contents : null;

  const formRef = React.useRef<React.ElementRef<"form">>(null);

  React.useEffect(() => {
    if (state && "success" in state) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form action={formAction} ref={formRef} className="relative">
      <div className="w-full  flex flex-col gap-2 border rounded-md border-muted/20 p-2 focus-within:ring-2 ring-blue-500/50 focus-within:border-blue-500">
        <textarea
          name="contents"
          id="contents"
          className="w-full focus:outline-none"
          rows={2}
          placeholder="What is on your mind?"
          required
        />

        <div className="h-12 text-left pr-20">
          {errors && <p className="text-red-400">{errors}</p>}
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
