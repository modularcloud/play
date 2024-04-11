export const cacheKeys = {
  posts: {
    list: () => ["POSTS"],
    detail: () => ["POST_SINGLE"],
    single: (id: number) => [
      ...cacheKeys.posts.detail(),
      `POST-${id.toString()}`
    ]
  }
} as const;
