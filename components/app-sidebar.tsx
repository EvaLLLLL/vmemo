'use client'

import {
  BookOpen,
  Command,
  Database,
  Github,
  SunMoon,
  LayoutDashboard,
  BookMarkedIcon
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navMainData = [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
      isActive: true
    },
    {
      title: 'Dictionary',
      url: '/dictionary',
      icon: BookMarkedIcon
    },
    {
      title: 'Reading',
      url: '/reading',
      icon: BookOpen
    },
    {
      title: 'Memorizing',
      url: '/memorizing',
      icon: Database
    },
    {
      title: 'My Vocabulary',
      url: '/vocabulary',
      icon: Database
    }
  ]

  const navSecondaryData = [
    {
      title: 'Github',
      url: '#',
      icon: Github
    },
    {
      title: 'Theme',
      url: '#',
      icon: SunMoon
    }
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData} />
        <NavSecondary items={navSecondaryData} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
