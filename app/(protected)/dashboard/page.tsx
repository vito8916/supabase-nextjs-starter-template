import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Monitor } from "lucide-react";
import {
	MoveDownRight,
	MoveUpRight,
	User2Icon,
	RefreshCcwIcon,
} from "lucide-react";
import { getUserProfile } from "@/app/actions/settings/profile-actions";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import UserAccountDetailsCard from "@/components/dashboard/user-account-details-card";
import { Spinner } from "@/components/ui/spinner";

async function DashboardContent() {
	const userProfileInfo = await getUserProfile();
	
	return (
		<UserAccountDetailsCard userProfileInfo={userProfileInfo!} />
	);
}

export default function DashboardPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			<div className="grid auto-rows-auto grid-cols-3 gap-5 md:grid-cols-3 lg:grid-cols-4 mb-4">
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Total Revenue</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							$1,250.00
						</CardTitle>
						<CardAction>
							<Badge variant="outline">
								<MoveDownRight />
								+12.5%
							</Badge>
						</CardAction>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Trending up this month{" "}
							<MoveUpRight className="size-4" />
						</div>
						<div className="text-muted-foreground">
							Visitors for the last 6 months
						</div>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>New Customers</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							1,234
						</CardTitle>
						<CardAction>
							<Badge variant="outline">
								<MoveUpRight />
								-20%
							</Badge>
						</CardAction>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Down 20% this period{" "}
							<MoveUpRight className="size-4" />
						</div>
						<div className="text-muted-foreground">
							Acquisition needs attention
						</div>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Active Accounts</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							45,678
						</CardTitle>
						<CardAction>
							<Badge variant="outline">
								<MoveUpRight />
								+12.5%
							</Badge>
						</CardAction>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Strong user retention{" "}
							<MoveUpRight className="size-4" />
						</div>
						<div className="text-muted-foreground">
							Engagement exceed targets
						</div>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Growth Rate</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							4.5%
						</CardTitle>
						<CardAction>
							<Badge variant="outline">
								<MoveUpRight />
								+4.5%
							</Badge>
						</CardAction>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Steady performance increase{" "}
							<MoveUpRight className="size-4" />
						</div>
						<div className="text-muted-foreground">
							Meets growth projections
						</div>
					</CardFooter>
				</Card>
			</div>
			<div className="flex gap-4 w-full justify-between">
				<Suspense fallback={
					<Card className="w-full">
						<CardContent className="p-6">
							<div className="flex justify-center items-center h-32">
								<Spinner className="size-8" />
							</div>
						</CardContent>
					</Card>
				}>
					<DashboardContent />
				</Suspense>
				{/* Recent Login Activity Card */}
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Monitor className="h-5 w-5" />
							Recent Login Activity
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<User2Icon />
								</EmptyMedia>
								<EmptyTitle>No Login Activity</EmptyTitle>
								<EmptyDescription>
									There is no login activity to display.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button variant="outline" size="sm">
									<RefreshCcwIcon />
									Refresh
								</Button>
							</EmptyContent>
						</Empty>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
