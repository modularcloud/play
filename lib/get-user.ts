import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";
import { getAddress } from "~/auth";
import { UsersTable, db } from "~/lib/db";

export const getCurrentUser = cache(async function getCurrentUser() {
  const address = await getAddress();
  const [user] = await db
    .insert(UsersTable)
    .values({
      address
    })
    .onConflictDoUpdate({
      target: UsersTable.address,
      set: {
        address
      }
    })
    .returning();

  return user;
});
