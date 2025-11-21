"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { columns } from "@/components/projects/columns";
import { DataTable } from "@/components/shared/ui/data-table/data-table";
import { bulkDeleteProjectsAction } from "@/app/actions/projects/actions";
import type { ProjectDTO } from "@/types/projects";

interface ProjectsContentProps {
    projectsPromise: Promise<ProjectDTO[]>;
}

/* Faceted filters for the projects table */
const facetedFilters = [
    {
        label: "Status",
        value: "status",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ]
    },
    {
        label: "Visibility",
        value: "visibility",
        options: [
            { label: "Public", value: "public" },
            { label: "Private", value: "private" },
        ]
    }
]

function ProjectsContent({ projectsPromise }: ProjectsContentProps) {
    const router = useRouter();
    const projects = use(projectsPromise); // Unwrap the Promise here

    const handleDelete = async (ids: string[]) => {
        const result = await bulkDeleteProjectsAction(ids);
        if (!result.ok) {
            throw new Error((result.error as { message: string })?.message ?? "Failed to delete projects");
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
            facetedFilters={facetedFilters}
        />
    );
}

export default ProjectsContent;