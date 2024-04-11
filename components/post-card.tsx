import { MessageCircleMore } from "lucide-react";
import Link from "next/link";
import type { Post, User } from "~/lib/db";
import { cn } from "~/lib/utils";

export type PostCardProps = {
  post: Pick<Post, "id" | "contents"> & {
    replyCount: number;
    author: Pick<User, "address" | "name">;
  };
  className?: string;
};

export function PostCard({ post, className }: PostCardProps) {
  return (
    <div
      className={cn(
        "bg-white w-[32rem] mx-auto rounded-md border border-muted/20 flex flex-col mb-4",
        className
      )}
    >
      <div className="border-b border-muted/20 flex flex-col gap-1 font-medium py-3.5 px-4.5">
        {post.author.name ? (
          <>
            <h2>{post.author.name}</h2>
            <small className="text-muted">({post.author.address})</small>
          </>
        ) : (
          <h2>{post.author.address}</h2>
        )}
      </div>

      <blockquote className="border-b border-muted/20 py-3 px-4.5 before:[content:open-quote] after:[content:close-quote]">
        {post.contents}
      </blockquote>

      <div className="text-end text-gray-600 py-2.5 px-4.5">
        <Link
          href={`/post/${post.id}`}
          className="underline cursor-pointer flex items-center gap-1 justify-end"
        >
          <MessageCircleMore className="h-4 w-4" />
          <span>{post.replyCount} replies</span>
        </Link>
      </div>
    </div>
  );
}
