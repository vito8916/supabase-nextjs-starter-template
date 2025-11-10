export type ProjectDTO = {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
    visibility: "private" | "public";
    status: "active" | "inactive" | "completed" | "canceled" | "archived";
    created_at: string;
    updated_at: string;
};

/**
 * Internal ProjectRow type - matches database schema exactly
 * Should NOT be exposed outside the DAL
 */
export type ProjectRow = {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
    visibility: "private" | "public";
    status: "active" | "inactive" | "completed" | "canceled" | "archived";
    created_at: string;
    updated_at: string;
};