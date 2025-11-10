"use client";

import React, { useId, useRef, useState } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	VisibilityState,
	Column,
} from "@tanstack/table-core";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
	CircleAlert,
	CircleX,
	Columns3,
	ListFilter,
	Trash,
	Download,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onDelete?: (ids: string[]) => Promise<void>;
	filterColumn?: string;
	filterPlaceholder?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	onDelete,
	filterColumn = "name",
	filterPlaceholder = "Filter...",
}: DataTableProps<TData, TValue>) {
	const id = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		enableSortingRemoval: false,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
	});

	const handleDeleteRows = async () => {
		const selectedRows = table.getSelectedRowModel().rows;
		const selectedIds = selectedRows.map((row) => {
			const record = row.original as Record<string, unknown>;
			return record.id as string;
		});

		if (onDelete) {
			try {
				const loadingToast = toast.loading(
					`Deleting ${selectedIds.length} item${
						selectedIds.length > 1 ? "s" : ""
					}...`
				);
				await onDelete(selectedIds);
				toast.dismiss(loadingToast);
				toast.success(
					`${selectedIds.length} item${
						selectedIds.length > 1 ? "s" : ""
					} deleted`
				);
				table.resetRowSelection();
			} catch (error) {
				console.error("Error deleting items:", error);
				toast.error("Failed to delete items");
			}
		}
	};

	const handleExport = () => {
		try {
			// Filter out non-data columns (select and actions)
			const exportableColumns = columns.filter(
				(col) =>
					col.id !== "select" &&
					col.id !== "actions" &&
					"accessorKey" in col &&
					col.accessorKey
			);

			// Create headers with proper names
			const headers = exportableColumns.map((column) => {
				if (typeof column.header === "string") {
					return column.header;
				}
				// For non-string headers, use the accessor key as fallback
				const accessorKey =
					"accessorKey" in column ? column.accessorKey : "";
				return accessorKey ? String(accessorKey) : "Unknown";
			});

			// Process rows with proper data handling
			const rows = data.map((item) =>
				exportableColumns.map((column) => {
					const accessorKey =
						"accessorKey" in column
							? (column.accessorKey as string)
							: undefined;
					if (!accessorKey) return "";

					const record = item as Record<string, unknown>;
					let value = record[accessorKey];

					// Handle date formatting
					if (accessorKey === "createdAt" && value) {
						try {
							value = format(
								new Date(value as string),
								"dd MMM, yyyy"
							);
						} catch (error) {
							console.warn("Date formatting error:", error);
						}
					}

					// Handle null/undefined values
					if (value === null || value === undefined) {
						return "";
					}

					// Convert to string and escape commas and quotes
					let stringValue = String(value);
					// If the value contains commas, quotes, or newlines, wrap it in quotes
					if (
						stringValue.includes(",") ||
						stringValue.includes('"') ||
						stringValue.includes("\n")
					) {
						// Escape existing quotes by doubling them
						stringValue =
							'"' + stringValue.replace(/"/g, '""') + '"';
					}
					return stringValue;
				})
			);

			// Create CSV content with proper escaping
			const csvContent = [
				headers
					.map((header) =>
						header.includes(",") || header.includes('"')
							? `"${header.replace(/"/g, '""')}"`
							: header
					)
					.join(","),
				...rows.map((row) => row.join(",")),
			].join("\n");

			// Add BOM for proper UTF-8 encoding in Excel
			const BOM = "\uFEFF";
			const blob = new Blob([BOM + csvContent], {
				type: "text/csv;charset=utf-8;",
			});

			// Create download link
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			// Generate filename with timestamp
			const now = new Date();
			const timestamp = format(now, "yyyy-MM-dd_HH-mm");
			link.download = `projects-export_${timestamp}.csv`;

			// Trigger download
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up the blob URL
			URL.revokeObjectURL(link.href);

			// Show success notification
			toast.success("Export completed!", {
				description: `Exported ${data.length} item${
					data.length !== 1 ? "s" : ""
				} to CSV.`,
				duration: 3000,
			});
		} catch (error) {
			console.error("Export error:", error);
			toast.error("Export failed", {
				description:
					error instanceof Error
						? error.message
						: "An unexpected error occurred during export.",
				duration: 5000,
			});
		}
	};

	// compute left/right offsets for sticky columns
	const getPinningStyles = (column: Column<TData>): React.CSSProperties => {
		const pin = column.getIsPinned();
		return {
			position: pin ? "sticky" : undefined,
			left: pin === "left" ? `${column.getStart("left")}px` : undefined,
			right:
				pin === "right" ? `${column.getAfter("right")}px` : undefined,
			zIndex: pin ? 10 : undefined,
			backgroundColor: pin ? "bg-card dark:bg-background" : undefined,
		};
	};

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					{/* Filter by column */}
					<div className="relative">
						<Input
							id={`${id}-input`}
							ref={inputRef}
							className={cn(
								"peer min-w-60 ps-9",
								Boolean(
									table
										.getColumn(filterColumn)
										?.getFilterValue()
								) && "pe-9"
							)}
							value={
								(table
									.getColumn(filterColumn)
									?.getFilterValue() ?? "") as string
							}
							onChange={(e) =>
								table
									.getColumn(filterColumn)
									?.setFilterValue(e.target.value)
							}
							placeholder={filterPlaceholder}
							type="text"
							aria-label={filterPlaceholder}
						/>
						<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
							<ListFilter
								size={16}
								strokeWidth={2}
								aria-hidden="true"
							/>
						</div>
						{Boolean(
							table.getColumn(filterColumn)?.getFilterValue()
						) && (
							<button
								className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Clear filter"
								onClick={() => {
									table
										.getColumn(filterColumn)
										?.setFilterValue("");
									if (inputRef.current) {
										inputRef.current.focus();
									}
								}}
							>
								<CircleX
									size={16}
									strokeWidth={2}
									aria-hidden="true"
								/>
							</button>
						)}
					</div>

					{/* Toggle columns visibility */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="border border-border"
								variant="outline"
							>
								<Columns3
									className="-ms-1 me-2 opacity-60"
									size={16}
									strokeWidth={2}
									aria-hidden="true"
								/>
								View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>
								Toggle columns
							</DropdownMenuLabel>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
											onSelect={(event) =>
												event.preventDefault()
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Delete button */}
					{onDelete &&
						table.getSelectedRowModel().rows.length > 0 && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										className="ml-auto border border-border"
										variant="outline"
									>
										<Trash
											className="-ms-1 me-2 opacity-60"
											size={16}
											strokeWidth={2}
											aria-hidden="true"
										/>
										Delete
										<span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
											{
												table.getSelectedRowModel().rows
													.length
											}
										</span>
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
										<div
											className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
											aria-hidden="true"
										>
											<CircleAlert
												className="opacity-80"
												size={16}
												strokeWidth={2}
											/>
										</div>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
												This will permanently delete{" "}
												{
													table.getSelectedRowModel()
														.rows.length
												}{" "}
												selected{" "}
												{table.getSelectedRowModel()
													.rows.length === 1
													? "row"
													: "rows"}
												.
											</AlertDialogDescription>
										</AlertDialogHeader>
									</div>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleDeleteRows}
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
				</div>

				<div className="flex items-center gap-3">
					<Button
						onClick={handleExport}
						variant="outline"
						size="sm"
						disabled={data.length === 0}
					>
						<Download className="mr-2 h-4 w-4" />
						Export CSV
						{data.length > 0 && (
							<span className="-me-1 ms-2 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
								{data.length}
							</span>
						)}
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto rounded-lg border border-border bg-background">
				<Table className="table-fixed">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:bg-transparent"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="last:py-0"
											style={getPinningStyles(
												cell.column
											)}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between gap-8">
				{/* Results per page */}
				<div className="flex items-center gap-3">
					<Label htmlFor={id} className="max-sm:sr-only">
						Rows per page
					</Label>
					<Select
						value={table.getState().pagination.pageSize.toString()}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger
							id={id}
							className="w-fit whitespace-nowrap"
						>
							<SelectValue placeholder="Select number of results" />
						</SelectTrigger>
						<SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
							{[5, 10, 25, 50].map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={pageSize.toString()}
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Page number information */}
				<div className="flex grow justify-end whitespace-nowrap text-sm text-muted-foreground">
					<p
						className="whitespace-nowrap text-sm text-muted-foreground"
						aria-live="polite"
					>
						<span className="text-foreground">
							{table.getState().pagination.pageIndex *
								table.getState().pagination.pageSize +
								1}
							-
							{Math.min(
								Math.max(
									table.getState().pagination.pageIndex *
										table.getState().pagination.pageSize +
										table.getState().pagination.pageSize,
									0
								),
								table.getRowCount()
							)}
						</span>{" "}
						of{" "}
						<span className="text-foreground">
							{table.getRowCount().toString()}
						</span>
					</p>
				</div>

				{/* Pagination buttons */}
				<div>
					<Pagination>
						<PaginationContent>
							{/* First page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.firstPage()}
									disabled={!table.getCanPreviousPage()}
									aria-label="Go to first page"
								>
									<ChevronFirst
										size={16}
										strokeWidth={2}
										aria-hidden="true"
									/>
								</Button>
							</PaginationItem>
							{/* Previous page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
									aria-label="Go to previous page"
								>
									<ChevronLeft
										size={16}
										strokeWidth={2}
										aria-hidden="true"
									/>
								</Button>
							</PaginationItem>
							{/* Next page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
									aria-label="Go to next page"
								>
									<ChevronRight
										size={16}
										strokeWidth={2}
										aria-hidden="true"
									/>
								</Button>
							</PaginationItem>
							{/* Last page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.lastPage()}
									disabled={!table.getCanNextPage()}
									aria-label="Go to last page"
								>
									<ChevronLast
										size={16}
										strokeWidth={2}
										aria-hidden="true"
									/>
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);
}
