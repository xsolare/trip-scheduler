CREATE TYPE "public"."trip_section_type" AS ENUM('bookings', 'finances', 'checklist', 'notes');--> statement-breakpoint
CREATE TABLE "trip_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"type" "trip_section_type" NOT NULL,
	"title" text NOT NULL,
	"icon" text,
	"content" jsonb DEFAULT '{}',
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trip_sections" ADD CONSTRAINT "trip_sections_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;