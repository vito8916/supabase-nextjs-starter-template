"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import AddProjectForm from "@/components/projects/add-project-form";
import { useState } from "react";

export function ProjectSheet() {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setIsOpen(false);
		}
	};
	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<SheetTrigger asChild>
				<Button variant="outline">New Project</Button>
			</SheetTrigger>
			<SheetContent className="w-full md:max-w-xl overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when
						you&apos;re done.
					</SheetDescription>
				</SheetHeader>
				<div className="w-full px-4">
					<AddProjectForm handleOpenChange={handleOpenChange} />
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
