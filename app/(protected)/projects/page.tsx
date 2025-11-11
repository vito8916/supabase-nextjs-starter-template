import {Button} from "@/components/ui/button";
import {Suspense} from "react";
import ProjectsTableSkeleton from "@/components/projects/projects-table-skeleton";
import ProjectsContent from "@/components/projects/content";
import {getProjectsAction} from "@/app/actions/projects/actions";
import {ProjectSheet} from "@/components/projects/project-sheet";

async function ProjectsPage() {
    const projectsPromise = getProjectsAction();

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between gap-4 items-center md:items-center pb-2 border-b">
                <div>
                    <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                        Projects
                    </h1>
                    <p className="hidden md:block text-muted-foreground mt-1">
                        View and manage your projects
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                   <ProjectSheet />
                </div>
            </div>
            <Suspense fallback={<ProjectsTableSkeleton />}>
                <ProjectsContent projectsPromise={projectsPromise} />
            </Suspense>
        </div>
    );
}

export default ProjectsPage;