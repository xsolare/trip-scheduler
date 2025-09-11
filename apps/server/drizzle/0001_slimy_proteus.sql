ALTER TABLE "comments" ALTER COLUMN "parent_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."comment_parent_type";--> statement-breakpoint
CREATE TYPE "public"."comment_parent_type" AS ENUM('trip', 'day');--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "parent_type" SET DATA TYPE "public"."comment_parent_type" USING "parent_type"::"public"."comment_parent_type";