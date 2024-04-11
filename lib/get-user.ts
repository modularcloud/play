import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";
import { UsersTable, db } from "~/lib/db";

export async function getAddress(userShare: string) {
  return "Celestia125mzh9pv6vnay0qlzl6sm8wkpfll3wzxsjhg8m";
}

export const getCurrentUser = cache(async function getCurrentUser() {
  const userShare = cookies().get("userShare")?.value!;
  const address = await getAddress(userShare);
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
