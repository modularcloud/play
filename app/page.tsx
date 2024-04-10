import { desc, eq, sql } from "drizzle-orm";
import type { Metadata } from "next";
import { PostsTable, ReplyTable, db } from "~/lib/db";

export const metadata: Metadata = {
  title: "Home | TwiXChain"
};

export default async function Home() {
  const posts = await db
    .select()
    .from(PostsTable)
    .orderBy(desc(PostsTable.created_at))
    .limit(50);

  const postid_list = posts.map((p) => p.id);
  const replyList =
    posts.length === 0
      ? []
      : await db
          .selectDistinct({
            id: ReplyTable.id,
            post_id: PostsTable.id
          })
          .from(ReplyTable)
          .innerJoin(PostsTable, eq(PostsTable.id, ReplyTable.parent_id))
          .where(sql`${PostsTable.id} in ${postid_list}`);

  const postList = posts.map((p) => {
    const replyCount = replyList.filter((r) => r.post_id === p.id).length;

    return {
      ...p,
      replyCount
    };
  });

  return (
    <main className="flex flex-col">
      <h1 className="text-xl font-semibold">Hello TwiXChain</h1>
      <ul className="">
        {postList.map((post) => (
          <li key={post.id}>
            <p>{post.contents}</p>
            <hr />
            {post.replyCount} replies
          </li>
        ))}
      </ul>
    </main>
  );
}
