import { ComponentProps, Suspense } from "react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavProjects } from "@/components/dashboard/nav-projects"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getUserProfile } from "@/app/actions/settings/profile-actions";
import VicboxLogo from "@/components/vicbox-logo";
import NavUserSkeleton from "./nav-user-skeleton"

/**
 * Async component that fetches user profile and renders NavUser
 * This is wrapped in Suspense from the parent component
 */
async function NavUserWithData() {
  const userProfile = await getUserProfile();
  
  if (!userProfile) {
    return <NavUserSkeleton />;
  }

  return <NavUser userProfile={userProfile} />;
}

/**
 * AppSidebar - Static sidebar shell that streams dynamic user data
 * Only the footer (NavUser) requires dynamic data and is wrapped in Suspense
 */
export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <VicboxLogo />
                <span className="text-base font-semibold">SupaNext Kit2</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<NavUserSkeleton />}>
          <NavUserWithData />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
