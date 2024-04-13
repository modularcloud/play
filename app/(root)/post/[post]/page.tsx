import * as React from "react";
import type { Metadata } from "next";
import { Loader, MoveLeft } from "lucide-react";
import { PostsTable, UsersTable, db } from "~/lib/db";
import { asc, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "~/components/post-card";
import { nextCache } from "~/lib/next-cache";
import { cacheKeys } from "~/lib/cache-keys";
import { alias } from "drizzle-orm/pg-core";

export function generateMetadata(props: SinglePostpageProps): Metadata {
  return {
    title: `Post ${props.params.post}`
  };
}

type SinglePostpageProps = {
  params: {
    post: string;
  };
};

export default function SinglePostpage({
  params: { post }
}: SinglePostpageProps) {
  return (
    <div className="relative py-14">
      <Link
        href="/"
        className="text-muted underline flex items-center gap-1 fixed top-16 left-5"
      >
        <MoveLeft className="h-4 w-4" />
        <span>Back to Feed</span>
      </Link>
      <React.Suspense
        fallback={
          <div className="mx-auto py-14 text-center">
            <p className="flex gap-1 justify-center items-baseline">
              <span className="text-xl font-medium">Loading post...</span>
              <Loader className="h-5 w-5 animate-spin text-muted" />
            </p>
          </div>
        }
      >
        <SinglePost postId={Number(post)} />
      </React.Suspense>
    </div>
  );
}

async function SinglePost({ postId }: { postId: number }) {
  const getSinglePost = nextCache(
    async (postId: number) => {
      const [post] = await db
        .select({
          id: PostsTable.id,
          contents: PostsTable.contents,
          author: {
            address: UsersTable.address,
            name: UsersTable.name
          }
        })
        .from(PostsTable)
        .innerJoin(UsersTable, eq(UsersTable.id, PostsTable.author_id))
        .where(eq(PostsTable.id, postId));

      if (!post) {
        return null;
      }

      const replies = await db
        .selectDistinct({
          id: PostsTable.id,
          contents: PostsTable.contents,
          created_at: PostsTable.created_at,
          author: {
            address: UsersTable.address,
            name: UsersTable.name
          }
        })
        .from(PostsTable)
        .innerJoin(UsersTable, eq(UsersTable.id, PostsTable.author_id))
        .where(eq(PostsTable.parent_id, postId))
        .orderBy(asc(PostsTable.created_at));

      const replyIdList = replies.map((r) => r.id);

      const repliesToReplyList =
        replies.length === 0
          ? []
          : await db
              .selectDistinct({
                id: PostsTable.id,
                parent_id: PostsTable.parent_id
              })
              .from(PostsTable)
              .innerJoin(
                alias(PostsTable, "parent"),
                eq(PostsTable.id, PostsTable.parent_id)
              )
              .where(sql`${PostsTable.id} in ${replyIdList}`);

      const replyList = replies.map((p) => {
        const replyCount = repliesToReplyList.filter(
          (r) => r.parent_id === p.id
        ).length;

        return {
          ...p,
          replyCount
        };
      });
      return { post, replyList };
    },
    {
      tags: cacheKeys.posts.single(postId)
    }
  );

  const postWithReplies = await getSinglePost(postId);

  if (!postWithReplies) {
    notFound();
  }

  const { post, replyList } = postWithReplies;

  return (
    <ul className="mx-auto overflow-y-auto">
      <li>
        <PostCard post={{ ...post, replyCount: replyList.length }} />
      </li>

      {replyList.length === 0 ? (
        <div className="flex gap-2 justify-center items-center text-muted">
          <div className="h-px bg-muted/40 w-10" />
          <span className="italic">No reply yet</span>
          <div className="h-px bg-muted/40 w-10" />
        </div>
      ) : (
        replyList.map((reply) => (
          <li key={`reply-${reply.id}`} className="w-full">
            <PostCard post={{ ...reply }} className="w-[29rem]" />
          </li>
        ))
      )}
    </ul>
  );
}
