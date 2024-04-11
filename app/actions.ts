"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { cacheKeys } from "~/lib/cache-keys";
import { PostsTable, ReplyTable, UsersTable, db } from "~/lib/db";
import { getCurrentUser } from "~/lib/get-user";

const getPointsSchema = z.object({
  email: z.string().email()
});

export async function getPoints(_: any, formData: FormData) {
  const parseResult = getPointsSchema.safeParse(Object.fromEntries(formData));

  if (!parseResult.success) {
    return parseResult.error.flatten();
  }

  const user = await getCurrentUser();

  await db
    .update(UsersTable)
    .set({
      points: 200
    })
    .where(eq(UsersTable.address, user.address));

  revalidatePath("/");

  return {
    success: true
  };
}

const settingsSchema = z.object({
  name: z.string().min(1).max(40)
});

export async function updateSettings(_: any, formData: FormData) {
  const parseResult = settingsSchema.safeParse(Object.fromEntries(formData));

  if (!parseResult.success) {
    return parseResult.error.flatten();
  }

  const user = await getCurrentUser();

  await db
    .update(UsersTable)
    .set({
      name: parseResult.data.name
    })
    .where(eq(UsersTable.address, user.address));

  revalidatePath("/");

  for (const tag of cacheKeys.posts.list()) {
    revalidateTag(tag);
  }
  for (const tag of cacheKeys.posts.detail()) {
    revalidateTag(tag);
  }

  return {
    success: true
  };
}

const createPostSchema = z.object({
  contents: z.string().min(1).max(256)
});

export async function createPost(_: any, formData: FormData) {
  const parseResult = createPostSchema.safeParse(Object.fromEntries(formData));

  if (!parseResult.success) {
    return parseResult.error.flatten();
  }

  const user = await getCurrentUser();

  await db.insert(PostsTable).values({
    contents: parseResult.data.contents,
    author_id: user.id,
    created_at: new Date().getTime()
  });

  revalidatePath("/");
  for (const tag of cacheKeys.posts.list()) {
    revalidateTag(tag);
  }

  return {
    success: true
  };
}

const createReplySchema = z.object({
  contents: z.string().min(1).max(256),
  parentId: z.coerce.number()
});

export async function createReply(_: any, formData: FormData) {
  const parseResult = createReplySchema.safeParse(Object.fromEntries(formData));

  if (!parseResult.success) {
    return parseResult.error.flatten();
  }

  const parentId = parseResult.data.parentId;
  const user = await getCurrentUser();

  await db.insert(ReplyTable).values({
    parent_id: parentId,
    contents: parseResult.data.contents,
    author_id: user.id,
    created_at: new Date().getTime()
  });

  revalidatePath("/");
  for (const tag of cacheKeys.posts.list()) {
    revalidateTag(tag);
  }
  const [__, singleTag] = cacheKeys.posts.single(parentId);
  revalidateTag(singleTag);

  return {
    success: true
  };
}
