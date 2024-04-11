import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {
  pgTable,
  serial,
  text,
  integer,
  varchar,
  index,
  bigint
} from "drizzle-orm/pg-core";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { logger: true });

export const UsersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 48 }).notNull().unique(),
  name: varchar("name", { length: 40 }),
  points: integer("points").notNull().default(0),
  email: varchar("email")
});

export const PostsTable = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    contents: varchar("contents", { length: 256 }).notNull(),
    author_id: integer("author_id")
      .references(() => UsersTable.id, {
        onDelete: "cascade"
      })
      .notNull(),
    created_at: bigint("created_at", { mode: "number" }).notNull()
  },
  (table) => ({
    created_at_idx: index("post_created_idx").on(table.created_at)
  })
);

export const ReplyTable = pgTable(
  "replies",
  {
    id: serial("id").primaryKey(),
    contents: varchar("contents", { length: 256 }).notNull(),
    author_id: integer("author_id")
      .references(() => UsersTable.id, {
        onDelete: "cascade"
      })
      .notNull(),
    parent_id: integer("parent_id")
      .references(() => PostsTable.id, {
        onDelete: "cascade"
      })
      .notNull(),
    created_at: bigint("created_at", { mode: "number" }).notNull()
  },
  (table) => ({
    created_at_idx: index("reply_created_idx").on(table.created_at)
  })
);

export type User = typeof UsersTable.$inferSelect;
export type Post = typeof PostsTable.$inferSelect;
export type Reply = typeof ReplyTable.$inferSelect;
