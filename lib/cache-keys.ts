export const cacheKeys = {
  posts: {
    all: () => ["POSTS"],
    single: (id: number) => [`POST_SINGLE-${id.toString()}`]
  }
} as const;
