CREATE TYPE "public"."activity_section_type" AS ENUM('description', 'gallery', 'geolocation');--> statement-breakpoint
CREATE TYPE "public"."activity_status" AS ENUM('none', 'completed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."activity_tag" AS ENUM('transport', 'walk', 'food', 'attraction', 'relax');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('completed', 'planned', 'draft');--> statement-breakpoint
CREATE TYPE "public"."trip_image_placement" AS ENUM('route', 'memories');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"title" text NOT NULL,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tag" "activity_tag",
	"status" "activity_status" DEFAULT 'none' NOT NULL,
	"rating" integer,
	"day_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "days" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"trip_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"timestamp" timestamp with time zone,
	"comment" text,
	"image_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"trip_id" uuid NOT NULL,
	"placement" "trip_image_placement" DEFAULT 'route' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image_url" text,
	"description" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"cities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"budget" real,
	"currency" text DEFAULT 'RUB',
	"participants" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"visibility" "visibility" DEFAULT 'private' NOT NULL,
	"days" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_day_id_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "days" ADD CONSTRAINT "days_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memories" ADD CONSTRAINT "memories_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memories" ADD CONSTRAINT "memories_image_id_trip_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."trip_images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_images" ADD CONSTRAINT "trip_images_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;