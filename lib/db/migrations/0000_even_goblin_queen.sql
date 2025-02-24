CREATE TYPE "public"."deal_type" AS ENUM('SCRAPED', 'MANUAL', 'AI_INFERRED');--> statement-breakpoint
CREATE TYPE "public"."sentiment" AS ENUM('POSITIVE', 'NEUTRAL', 'NEGATIVE');--> statement-breakpoint
CREATE TYPE "public"."sim_status" AS ENUM('IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "ai_screening" (
	"id" serial PRIMARY KEY NOT NULL,
	"dealId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"explanation" text NOT NULL,
	"sentiment" "sentiment" DEFAULT 'NEUTRAL' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deal" (
	"id" serial PRIMARY KEY NOT NULL,
	"brokerage" varchar(255) NOT NULL,
	"firstName" varchar(255),
	"lastName" varchar(255),
	"email" varchar(255),
	"linkedinUrl" varchar(255),
	"workPhone" varchar(255),
	"dealCaption" text NOT NULL,
	"revenue" numeric NOT NULL,
	"ebitda" numeric NOT NULL,
	"title" varchar(255),
	"grossRevenue" numeric,
	"askingPrice" numeric,
	"ebitdaMargin" numeric NOT NULL,
	"industry" varchar(255) NOT NULL,
	"dealType" "deal_type" DEFAULT 'MANUAL' NOT NULL,
	"sourceWebsite" varchar(255) NOT NULL,
	"companyLocation" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questionnaires" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileUrl" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"purpose" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"version" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sim" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"caption" varchar(255) NOT NULL,
	"status" "sim_status" NOT NULL,
	"fileName" varchar(255) NOT NULL,
	"fileType" varchar(255) NOT NULL,
	"fileUrl" varchar(255) NOT NULL,
	"dealId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "todo_text_unique" UNIQUE("text")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"image" varchar(255),
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"isBlocked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ai_screening" ADD CONSTRAINT "ai_screening_dealId_deal_id_fk" FOREIGN KEY ("dealId") REFERENCES "public"."deal"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sim" ADD CONSTRAINT "sim_dealId_deal_id_fk" FOREIGN KEY ("dealId") REFERENCES "public"."deal"("id") ON DELETE no action ON UPDATE no action;