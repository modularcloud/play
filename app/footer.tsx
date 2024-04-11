"use client";

import type { User } from "~/lib/db";

export type FooterProps = {
  user: User;
  form: React.ReactNode;
};

export function Footer({ user, form }: FooterProps) {
  return (
    <footer className="grid flex-none grid-cols-12 w-full border-t border-muted/20 bg-white">
      <dl className="border-r w-full flex flex-col justify-center border-muted/20 col-span-4 py-3 px-[1.125rem] text-sm">
        <div className="grid grid-cols-8">
          <dt className="col-span-2 text-muted">Address:</dt>
          <dd className="col-span-6">
            <p className="text-ellipsis whitespace-nowrap overflow-x-hidden flex-shrink flex-grow-0 max-w-full">
              {user.address}
            </p>
          </dd>
        </div>
        <div className="grid grid-cols-8">
          <dt className="col-span-2 text-muted">Name:</dt>
          <dd className="col-span-6 flex gap-2 items-baseline">
            {user.name ? (
              <p className="text-ellipsis whitespace-nowrap overflow-x-hidden flex-shrink flex-grow-0 max-w-full">
                {user.name}
              </p>
            ) : (
              <>
                <span className="text-muted text-xs italic">&lt;Empty&gt;</span>
                <button className="underline">Set name</button>
              </>
            )}
          </dd>
        </div>
        <div className="grid grid-cols-8">
          <dt className="col-span-2 text-muted">Points:</dt>
          <dd className="col-span-6 flex gap-2">
            <p className="text-ellipsis whitespace-nowrap overflow-x-hidden flex-shrink flex-grow-0 max-w-full">
              {user.points}
            </p>

            {user.points === 0 && (
              <button className="underline">Get Points</button>
            )}
          </dd>
        </div>
      </dl>

      <div className="col-span-8 py-3 px-[1.125rem]">{form}</div>
    </footer>
  );
}
