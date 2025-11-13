import { Spinner } from "@/components/ui/spinner";
export default function SettingsLoading() {
	return (
		<div className="flex justify-center items-center h-full">
			<Spinner className="size-8" />
		</div>
	);
}
