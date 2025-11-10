"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { bulkDeleteProjectsAction } from "@/app/actions/projects/actions";
import type { ProjectDTO } from "@/types/projects";

interface ProjectsContentProps {
    projectsPromise: Promise<ProjectDTO[]>;
}

function ProjectsContent({ projectsPromise }: ProjectsContentProps) {
    const router = useRouter();
    const projects = use(projectsPromise); // Unwrap the Promise here

    const handleDelete = async (ids: string[]) => {
        const result = await bulkDeleteProjectsAction(ids);
        if (!result.ok) {
            throw new Error(result.error?.message || "Failed to delete projects");
        }
        // Refresh the page to show updated data
        router.refresh();
    };

    return (
        <DataTable
            columns={columns}
            data={projects} // Pass resolved data
            onDelete={handleDelete}
            filterColumn="name"
            filterPlaceholder="Filter by name..."
        />
    );
}

export default ProjectsContent;