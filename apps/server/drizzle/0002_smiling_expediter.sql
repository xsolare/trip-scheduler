ALTER TABLE "plans" ADD COLUMN "is_developing" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "trip_images" ADD COLUMN "original_name" text NOT NULL;