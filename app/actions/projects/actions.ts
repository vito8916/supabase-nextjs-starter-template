'use server'

import {cache} from "react";
import {createClient} from "@/lib/supabase/server";
import {getAuthUser} from "@/app/actions/auth/auth-actions";
import {ProjectDTO, ProjectRow} from "@/types/projects";
import {revalidatePath} from "next/cache";
import { ProjectSchemaValues } from "@/lib/validations-schemas/projects";

function must<T>(data: T | null, error: unknown, msg: string): T {
    if (error) throw error;
    if (!data) throw new Error(msg);
    return data;
}

/**
 * Mapper: Convert ProjectRow to ProjectDTO
 * Currently identical, but allows future divergence
 */
function toProjectDTO(row: ProjectRow): ProjectDTO {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        owner_id: row.owner_id,
        visibility: row.visibility,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}

//Get all projects from the projects table of Supabase
export const getProjectsAction = cache(async () => {
    const user = await getAuthUser();
    if (!user) throw new Error("User not authenticated");

    const supabase = await createClient();

    const query = supabase.from("projects").select("*").order("created_at", { ascending: false });

    const { data, error } = await query;
    const rows = must<ProjectRow[]>(data, error, "Failed to list projects");
    return rows.map(toProjectDTO);
});

/**
* Delete a project by ID
*/
export async function deleteProject(id: string) {
    const user = await getAuthUser();
    if (!user) throw new Error("User not authenticated");

    const supabase = await createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
}

/**
 * Create a new project
 */
export async function createProjectAction(data: ProjectSchemaValues) {
    const user = await getAuthUser();
    if (!user) throw new Error("User not authenticated");
    const supabase = await createClient();
    const { data: projectData, error } = await supabase.from("projects").insert({
        name: data.name,
        description: data.description,
        visibility: data.visibility,
        status: data.status,
        owner_id: user.sub,
    });
    if (error) throw error;
    revalidatePath("/projects");
    return projectData;
}


/**
 * Deletes multiple projects and their relationships
 */
export async function bulkDeleteProjectsAction(ids: string[]) {
    const user = await getAuthUser();
    if (!user) throw new Error("User not authenticated");
    if (!ids || ids.length === 0) {
        throw new Error("No project IDs provided");
    }

    // Delete projects
    try {
        // Delete each project (in sequence or parallel)
        await Promise.all(ids.map(id => deleteProject(id)));
        revalidatePath("/projects");
        return { ok: true };
    } catch (error) {
        return { ok: false, error: { message: error ?? "Bulk delete failed" } };
    }

}