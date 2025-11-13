import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { capitalizeText, cn, getInitials } from "@/lib/utils";
import {
	Mail,
	Calendar,
	Clock,
	ImageIcon,
	Monitor,
	MoveDownRight,
	MoveUpRight,
	User2Icon,
	RefreshCcwIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getAuthUser } from "@/app/actions/auth/auth-actions";
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

export default async function DashboardPage() {
	const user = await getAuthUser();
	const userProfileInfo = await getUserProfile();
	
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
				<Card className="w-full">
					<CardHeader className="pb-4">
						<div className="flex items-center space-x-4">
							<Avatar className="h-16 w-16">
								<AvatarImage
									src={userProfileInfo?.avatar_url ?? ""}
								/>
								<AvatarFallback className="text-lg font-semibold bg-primary/10">
									{getInitials(userProfileInfo?.full_name)}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<CardTitle className="text-2xl mb-2">
									Welcome back,{" "}
									{capitalizeText(
										userProfileInfo?.full_name ?? "N/A"
									)}
								</CardTitle>
								<Badge
									variant="outline"
									className={cn(
										userProfileInfo?.status === "active"
											? "bg-green-500/50 border-green-500/50"
											: "bg-destructive/10",
										"text-xs"
									)}
								>
									{userProfileInfo?.status}
								</Badge>
							</div>
						</div>
					</CardHeader>

					<Separator />

					<CardContent className="p-y-6">
						<h3 className="mb-4">Account Details</h3>
						<div className="grid gap-4">
							<div className="flex items-center space-x-3 text-sm">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">
									Email:
								</span>
								<span className="font-medium">
									{userProfileInfo?.email}
								</span>
							</div>

							<div className="flex items-center space-x-3 text-sm">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">
									Member since:
								</span>
								<span className="font-medium">
									{userProfileInfo?.created_at
										? formatDate(userProfileInfo.created_at)
										: "N/A"}
								</span>
							</div>

							<div className="flex items-center space-x-3 text-sm">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">
									Last active:
								</span>
								<span className="font-medium">
									{user?.last_sign_in_at
										? formatDate(user.last_sign_in_at)
										: "N/A"}
								</span>
							</div>

							<div className="flex items-center space-x-3 text-sm">
								<ImageIcon className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">
									Avatar Url:
								</span>
								<span className="font-medium">
									{userProfileInfo?.avatar_url
										? userProfileInfo.avatar_url
										: "N/A"}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
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
