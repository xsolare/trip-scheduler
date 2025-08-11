CREATE TYPE "public"."activity_status" AS ENUM('none', 'completed', 'skipped');--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN "status" "activity_status" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN "rating" integer;