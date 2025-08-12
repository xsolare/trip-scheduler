ALTER TABLE "trip_images" ALTER COLUMN "placement" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "trip_images" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "trip_images" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "latitude" real;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "longitude" real;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "taken_at" timestamp;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "width" integer;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "orientation" integer;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "camera_make" text;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "camera_model" text;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "f_number" real;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "exposure_time" real;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "iso" integer;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "focal_length" real;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "aperture_value" real;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "other_metadata" jsonb;--> statement-breakpoint
ALTER TABLE "trip_images" DROP COLUMN "updated_at";