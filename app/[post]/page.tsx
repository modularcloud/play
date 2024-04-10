import type { Metadata } from "next";

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

export function SinglePostpage({ params: { post } }: SinglePostpageProps) {
  return (
    <main>
      <h1>Single Post</h1>
    </main>
  );
}
