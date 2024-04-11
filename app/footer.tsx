"use client";

import * as React from "react";
import { GetPointsForm } from "~/app/get-point-form";
import { SettingsForm } from "~/app/settings-form";
import type { User } from "~/lib/db";

export type FooterProps = {
  user: User;
  form: React.ReactNode;
};

export function Footer({ user, form }: FooterProps) {
  const [currentOpenedForm, setCurrentOpenedForm] = React.useState<
    "USER_SETTINGS_FORM" | "EMAIL_FORM" | null
  >(null);

  return (
    <footer className="relative grid flex-none grid-cols-12 w-full border-t border-muted/20 bg-white">
      {currentOpenedForm === "USER_SETTINGS_FORM" && (
        <SettingsForm
          onClose={() => setCurrentOpenedForm(null)}
          defaultName={user.name}
          className="absolute bottom-[calc(100%+0.5rem)] left-4.5"
        />
      )}
      {currentOpenedForm === "EMAIL_FORM" && (
        <GetPointsForm
          onClose={() => setCurrentOpenedForm(null)}
          className="absolute bottom-[calc(100%+0.5rem)] left-4.5"
        />
      )}

      <dl className="border-r w-full flex flex-col justify-center border-muted/20 col-span-4 py-3 px-4.5 text-sm">
        <div className="grid grid-cols-10">
          <dt className="col-span-2 text-muted">Address:</dt>
          <dd className="col-span-8">
            <p className="text-ellipsis font-medium whitespace-nowrap overflow-x-hidden flex-shrink flex-grow-0 max-w-full">
              {user.address}
            </p>
          </dd>
        </div>
        <div className="grid grid-cols-10">
          <dt className="col-span-2 text-muted">Name:</dt>
          <dd className="col-span-8 flex gap-2 items-baseline">
            {user.name ? (
              <p className="text-ellipsis font-medium whitespace-nowrap overflow-x-hidden flex-shrink flex-grow-0 max-w-full">
                {user.name}
              </p>
            ) : (
              <span className="text-muted text-xs italic">&lt;Empty&gt;</span>
            )}

            <button
              className="underline"
              onClick={() => setCurrentOpenedForm("USER_SETTINGS_FORM")}
            >
              {user.name ? "Update" : "Set"} name
            </button>
          </dd>
        </div>
        <div className="grid grid-cols-10">
          <dt className="col-span-2 text-muted">Points:</dt>
          <dd className="col-span-8 flex gap-2">
            <p className="text-ellipsis font-medium whitespace-nowrap overflow-x-hidden flex-shrink flex-grow-0 max-w-full">
              {user.points}
            </p>

            {user.points === 0 && (
              <button
                className="underline"
                onClick={() => setCurrentOpenedForm("EMAIL_FORM")}
              >
                Get Points
              </button>
            )}
          </dd>
        </div>
      </dl>

      <div className="col-span-8 py-3 px-[1.125rem]">{form}</div>
    </footer>
  );
}
