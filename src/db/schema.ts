import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  serial,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/* ── Users ── */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("reader"),
  avatar: text("avatar"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ── Sessions ── */
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Categories ── */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Tags ── */
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Posts (essays, notes, research, journal) ── */
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull().default(""),
    contentHtml: text("content_html"),
    type: varchar("type", { length: 30 }).notNull().default("essay"),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    featured: boolean("featured").default(false),
    pinned: boolean("pinned").default(false),
    coverImage: text("cover_image"),
    readingTime: integer("reading_time").default(0),
    wordCount: integer("word_count").default(0),
    categoryId: integer("category_id").references(() => categories.id),
    authorId: integer("author_id").references(() => users.id),
    metaTitle: varchar("meta_title", { length: 500 }),
    metaDescription: text("meta_description"),
    ogImage: text("og_image"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("posts_type_idx").on(table.type),
    index("posts_status_idx").on(table.status),
    index("posts_published_idx").on(table.publishedAt),
  ]
);

/* ── Post Tags (many-to-many) ── */
export const postTags = pgTable(
  "post_tags",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("post_tags_unique").on(table.postId, table.tagId)]
);

/* ── Projects ── */
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  description: text("description"),
  content: text("content"),
  contentHtml: text("content_html"),
  coverImage: text("cover_image"),
  techStack: jsonb("tech_stack").$type<string[]>().default([]),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  featured: boolean("featured").default(false),
  sortOrder: integer("sort_order").default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ── Quotes ── */
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  author: varchar("author", { length: 255 }),
  source: varchar("source", { length: 500 }),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Books ── */
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  coverImage: text("cover_image"),
  notes: text("notes"),
  notesHtml: text("notes_html"),
  rating: integer("rating"),
  status: varchar("status", { length: 20 }).notNull().default("reading"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ── Newsletter Subscribers ── */
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  confirmed: boolean("confirmed").default(false),
  token: text("token"),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

/* ── Comments ── */
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  parentId: integer("parent_id"),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  content: text("content").notNull(),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Page Views / Analytics ── */
export const pageViews = pgTable(
  "page_views",
  {
    id: serial("id").primaryKey(),
    path: text("path").notNull(),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    country: varchar("country", { length: 10 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("page_views_path_idx").on(table.path)]
);

/* ── Site Settings (key-value) ── */
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ── Media Library ── */
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 500 }).notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  altText: text("alt_text"),
  folder: varchar("folder", { length: 255 }).default("uploads"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
