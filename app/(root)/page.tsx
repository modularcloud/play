import * as React from "react";

import { desc, eq, isNull, sql } from "drizzle-orm";
import type { Metadata } from "next";
import { PostsTable, UsersTable, db } from "~/lib/db";
import { Loader } from "lucide-react";
import { PostCard } from "~/components/post-card";
import { nextCache } from "~/lib/next-cache";
import { cacheKeys } from "~/lib/cache-keys";
import { alias } from "drizzle-orm/pg-core";

export const metadata: Metadata = {
  title: "Home"
};

export default async function Home() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto py-14 text-center">
          <p className="flex gap-1 justify-center items-baseline">
            <span className="text-xl font-medium">Loading posts...</span>
            <Loader className="h-5 w-5 animate-spin text-muted" />
          </p>
        </div>
      }
    >
      <HomeContents />
    </React.Suspense>
  );
}

async function HomeContents() {
  const getPosts = nextCache(
    async () => {
      const posts = await db
        .select({
          id: PostsTable.id,
          contents: PostsTable.contents,
          author: {
            address: UsersTable.address,
            name: UsersTable.name
          }
        })
        .from(PostsTable)
        .orderBy(desc(PostsTable.created_at))
        .innerJoin(UsersTable, eq(UsersTable.id, PostsTable.author_id))
        .where(isNull(PostsTable.parent_id))
        .limit(50);

      const postid_list = posts.map((p) => p.id);
      const replyList =
        posts.length === 0
          ? []
          : await db
              .selectDistinct({
                id: PostsTable.id,
                post_id: PostsTable.id
              })
              .from(PostsTable)
              .innerJoin(
                alias(PostsTable, "parent"),
                eq(PostsTable.id, PostsTable.parent_id)
              )
              .where(sql`${PostsTable.id} in ${postid_list}`);

      const postList = posts.map((p) => {
        const replyCount = replyList.filter((r) => r.post_id === p.id).length;

        return {
          ...p,
          replyCount
        };
      });
      return postList;
    },
    {
      tags: cacheKeys.posts.list()
    }
  );
  const posts = await getPosts();
  return posts.length === 0 ? (
    <div className="mx-auto py-14 text-center">
      <div className="text-center">
        <h2 className="text-xl font-medium">Not posts yet 😢</h2>
        <p className="text-muted italic">you can still write one</p>
      </div>
    </div>
  ) : (
    <ul className="mx-auto overflow-y-auto py-14">
      {posts.map((post) => (
        <li key={post.id} className="w-full">
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
