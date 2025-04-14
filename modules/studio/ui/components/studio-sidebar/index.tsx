"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator"
import { LogOutIcon, VideoIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { StudioSidebarHeader } from "./studio-sidebar-header"

export const StudioSidebar = () => {
    const pathName = usePathname()
    return (
        <Sidebar className="pt-16 z-40" collapsible="icon">
            <SidebarContent className="bg-background">
                <SidebarGroup>
                    <SidebarMenu>
                        <StudioSidebarHeader />
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={pathName === "/studio"} tooltip="Content" asChild>
                                <Link href="/studio">
                                    <VideoIcon className="size-5"/>
                                    <span className="text-sm">Content</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <Separator />
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Exit Studio" asChild>
                                <Link href="/">
                                    <LogOutIcon className="size-5"/>
                                    <span className="text-sm">Exit Studio</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}