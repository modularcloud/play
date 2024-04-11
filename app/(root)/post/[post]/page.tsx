import * as React from "react";
import type { Metadata } from "next";
import { Loader, MoveLeft } from "lucide-react";
import { PostsTable, ReplyTable, UsersTable, db } from "~/lib/db";
import { desc, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "~/components/post-card";
import { nextCache } from "~/lib/next-cache";
import { cacheKeys } from "~/lib/cache-keys";

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
      <Link href="/" className="text-muted underline flex items-center gap-1">
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

      const replyList = await db
        .selectDistinct({
          id: ReplyTable.id,
          post_id: PostsTable.id,
          contents: ReplyTable.contents,
          created_at: ReplyTable.created_at,
          author: {
            address: UsersTable.address,
            name: UsersTable.name
          }
        })
        .from(ReplyTable)
        .innerJoin(PostsTable, eq(PostsTable.id, ReplyTable.parent_id))
        .innerJoin(UsersTable, eq(UsersTable.id, PostsTable.author_id))
        .where(eq(PostsTable.id, postId))
        .orderBy(desc(ReplyTable.created_at));
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

      {replyList.map((reply) => (
        <li key={`reply-${reply.id}`} className="w-full">
          <PostCard post={{ ...reply, replyCount: 0 }} className="w-[29rem]" />
        </li>
      ))}
    </ul>
  );
}