ALTER TABLE "form_responses" ADD COLUMN "admin_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "form_responses" ADD COLUMN "website_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "admin_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_website_id_websites_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."websites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;