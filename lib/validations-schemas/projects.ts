
/*
    name: string;
    description: string | null;
    owner_id: string;
    visibility: "private" | "public";
    status: "active" | "inactive" | "completed" | "canceled" | "archived";
* */

import {z} from "zod";

/** General profile schema for projects page. */
export const projectSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Project name must be less than 50 characters").trim().toLowerCase(),
    description: z.string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
    visibility: z.enum(["private", "public"]),
    status: z.enum(["active", "inactive", "completed", "canceled", "archived"]),
});

export type ProjectSchemaValues = z.infer<typeof projectSchema>;