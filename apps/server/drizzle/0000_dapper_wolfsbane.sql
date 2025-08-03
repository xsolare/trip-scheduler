CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`day_id` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`title` text NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `days`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `days` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`date` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`image_url` text,
	`description` text,
	`days` integer DEFAULT 0,
	`start_date` text,
	`end_date` text,
	`status` text DEFAULT 'draft',
	`budget` real DEFAULT 0,
	`currency` text DEFAULT 'RUB',
	`visibility` text DEFAULT 'private'
);
