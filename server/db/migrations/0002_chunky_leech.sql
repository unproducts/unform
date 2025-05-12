CREATE TABLE "form_integrations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"form_id" uuid NOT NULL,
	"integration_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "form_integrations_form_id_integration_id_unique" UNIQUE("form_id","integration_id")
);
--> statement-breakpoint
ALTER TABLE "form_domains" DROP CONSTRAINT "form_domains_admin_id_admins_id_fk";
--> statement-breakpoint
ALTER TABLE "form_responses" DROP CONSTRAINT "form_responses_admin_id_admins_id_fk";
--> statement-breakpoint
ALTER TABLE "form_integrations" ADD CONSTRAINT "form_integrations_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_integrations" ADD CONSTRAINT "form_integrations_integration_id_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_domains" DROP COLUMN "admin_id";--> statement-breakpoint
ALTER TABLE "form_responses" DROP COLUMN "admin_id";