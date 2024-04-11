import { CreateReplyForm } from "./create-reply-form";

export default function Page({
  params: { post }
}: {
  params: {
    post: string;
  };
}) {
  return <CreateReplyForm parentId={Number(post)} />;
}
