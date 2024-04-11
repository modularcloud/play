export const cacheKeys = {
  posts: {
    list: () => ["POSTS"] as const,
    detail: () => ["POST_SINGLE"],
    single: (id: number) =>
      [...cacheKeys.posts.detail(), `POST-${id.toString()}`] as const
  }
} as const;
