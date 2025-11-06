import { ComponentProps } from "react"
import {
  GalleryVerticalEnd,
} from "lucide-react"

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
import {getUserProfile} from "@/app/actions/settings/profile-actions";

export async function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {

    
    const currentUser = await getUserProfile();
    if(!currentUser) {
        return null
    }

    const userInfo = {
        email: currentUser.email || "No email provided.",
        fullName: currentUser.full_name || "No name provided.",
        avatarUrl: currentUser.avatar_url || "",
    }

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
                <GalleryVerticalEnd className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
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
        <NavUser userInfo={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
