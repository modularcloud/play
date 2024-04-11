"use client";
import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createPost } from "~/app/actions";

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
    <form
      action={formAction}
      ref={formRef}
      className="w-full relative flex flex-col gap-2 border rounded-md border-muted/20"
    >
      <textarea
        name="contents"
        id="contents"
        className="w-full"
        rows={2}
        placeholder="What is on your mind?"
      />

      <div className="h-12 text-left pr-20">
        {errors && <p className="text-red-400">{errors}</p>}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 rounded-md py-1.5 text-sm"
      type="submit"
      disabled={pending}
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
