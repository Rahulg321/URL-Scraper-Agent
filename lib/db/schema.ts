import { InferSelectModel } from "drizzle-orm";
import {
  integer,
  text,
  boolean,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
  numeric,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);
export const dealTypeEnum = pgEnum("deal_type", [
  "SCRAPED",
  "MANUAL",
  "AI_INFERRED",
]);
export const simStatusEnum = pgEnum("sim_status", ["IN_PROGRESS", "COMPLETED"]);
export const sentimentEnum = pgEnum("sentiment", [
  "POSITIVE",
  "NEUTRAL",
  "NEGATIVE",
]);

// User table
export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: timestamp("emailVerified"),
  image: varchar("image", { length: 255 }),
  role: userRoleEnum("role").default("USER").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  isBlocked: boolean("isBlocked").default(false).notNull(),
});

export type User = InferSelectModel<typeof user>;

// Todo table
export const todo = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull().unique(),
});

export type Todo = InferSelectModel<typeof todo>;

// Deal table
export const deal = pgTable(
  "deal",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brokerage: varchar("brokerage", { length: 255 }).notNull(),
    firstName: varchar("firstName", { length: 255 }),
    lastName: varchar("lastName", { length: 255 }),
    email: varchar("email", { length: 255 }),
    linkedinUrl: varchar("linkedinUrl", { length: 255 }),
    workPhone: varchar("workPhone", { length: 255 }),
    dealCaption: text("dealCaption").notNull(),
    revenue: numeric("revenue").notNull(),
    ebitda: numeric("ebitda").notNull(),
    title: varchar("title", { length: 255 }),
    grossRevenue: numeric("grossRevenue"),
    askingPrice: numeric("askingPrice"),
    ebitdaMargin: numeric("ebitdaMargin").notNull(),
    industry: varchar("industry", { length: 255 }).notNull(),
    dealType: dealTypeEnum("dealType").default("MANUAL").notNull(),
    sourceWebsite: varchar("sourceWebsite", { length: 255 }).notNull(),
    companyLocation: varchar("companyLocation", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      uniqueDeal: unique().on(table.brokerage, table.title, table.industry),
    };
  }
);

export type Deal = InferSelectModel<typeof deal>;

// Sim table
export const sim = pgTable("sim", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  caption: varchar("caption", { length: 255 }).notNull(),
  status: simStatusEnum("status").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileType: varchar("fileType", { length: 255 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 255 }).notNull(),
  dealId: uuid("dealId")
    .notNull()
    .references(() => deal.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Sim = InferSelectModel<typeof sim>;

// AI Screening table
export const aiScreening = pgTable("ai_screening", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealId: uuid("dealId")
    .notNull()
    .references(() => deal.id),
  title: varchar("title", { length: 255 }).notNull(),
  explanation: text("explanation").notNull(),
  sentiment: sentimentEnum("sentiment").default("NEUTRAL").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AiScreening = InferSelectModel<typeof aiScreening>;

// Questionnaire table
export const questionnaire = pgTable("questionnaires", {
  id: uuid("id").primaryKey().defaultRandom(),
  fileUrl: varchar("fileUrl", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  purpose: varchar("purpose", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  version: varchar("version", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type Questionnaire = InferSelectModel<typeof questionnaire>;
