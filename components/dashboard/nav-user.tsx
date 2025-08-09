"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {signOutAction} from "@/app/actions/auth/auth-actions"
import {capitalizeText, getInitials} from "@/lib/utils";
import Link from "next/link";
import ProfilePicture from "@/components/dashboard/profile-picture";

interface UserInfo {
    email: string;
    fullName: string;
    avatarUrl: string;
}

export function NavUser({userInfo}: { userInfo: UserInfo}) {
    const {isMobile} = useSidebar()

    return (
        <>
            {
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <ProfilePicture
                                            fullName={ userInfo?.fullName }
                                            avatarUrl={ userInfo?.avatarUrl }
                                            className="w-12 h-12"
                                        />
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">
                                                {
                                                    capitalizeText(userInfo?.fullName)
                                                }
                                            </span>
                                            <span className="truncate text-xs">{userInfo?.email}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4"/>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                    side={isMobile ? "bottom" : "right"}
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={userInfo?.avatarUrl}/>
                                                <AvatarFallback className="text-lg font-semibold bg-primary/10">
                                                    {getInitials(userInfo?.fullName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">
                                                    {capitalizeText(userInfo?.fullName)}
                                                </span>
                                                <span className="truncate text-xs">{userInfo?.email}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link className="flex items-center gap-2 w-full" href="/settings">
                                                <BadgeCheck/>
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Bell/>
                                            Notifications
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={() => signOutAction()}>
                                        <LogOut/>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>

            }
        </>

    )
}
