CREATE TYPE "public"."trip_image_placement" AS ENUM('route', 'memories');--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "placement" "trip_image_placement" DEFAULT 'route' NOT NULL;