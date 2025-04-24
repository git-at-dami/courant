"use client"

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useAuth, useClerk } from "@clerk/nextjs"
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
    // {
    //     title: "History",
    //     url: "/playlists/history",
    //     icon: HistoryIcon,
    //     auth: true
    // },
    // {
    //     title: "Liked Videos",
    //     url: "/playlists/liked",
    //     icon: ThumbsUpIcon,
    //     auth: true
    // },
    // {
    //     title: "Playlists",
    //     url: "playlists",
    //     icon: ListVideoIcon,
    //     auth: true
    // }
]

export const PersonalSection = () => {
    const clerk = useClerk();
    const { isSignedIn: signedIn } = useAuth()
    const pathname = usePathname();
    
    return  (
        <SidebarGroup>
            <SidebarGroupLabel></SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {
                        items.map((item) => (
                            <SidebarMenuItem 
                                key={item.title}

                            >
                                <SidebarMenuButton 
                                    tooltip={item.title}
                                    asChild
                                    isActive={pathname === item.url}
                                    onClick={(e) => {
                                        if(!signedIn && item.auth) {
                                            e.preventDefault()
                                            clerk.openSignIn()
                                        }
                                    }}
                                >
                                    <Link prefetch href={item.url} className="flex items-center gap-4" >
                                        <item.icon />
                                        <span className="text-sm">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    }
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}