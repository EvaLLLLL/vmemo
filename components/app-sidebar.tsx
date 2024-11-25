'use client'

import {
  BookOpen,
  Command,
  Database,
  Github,
  LayoutDashboard,
  BookMarkedIcon,
  WalletCards,
  SunIcon,
  MoonIcon
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
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from 'next-themes'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated } = useAuth()

  const pathname = usePathname()

  const navMainData = [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
      isActive: pathname === '/',
      disabled: !isAuthenticated
    },
    {
      title: 'Dictionary',
      url: '/dictionary',
      icon: BookMarkedIcon,
      isActive: pathname === '/dictionary'
    },
    {
      title: 'Reading',
      url: '/reading',
      icon: BookOpen,
      isActive: pathname === '/reading'
    },
    {
      title: 'Flashcard',
      url: '/flashcard',
      icon: WalletCards,
      isActive: pathname === '/flashcard',
      disabled: !isAuthenticated
    },
    {
      title: 'Vocabulary List',
      url: '/vocabulary',
      icon: Database,
      isActive: pathname === '/vocabulary',
      disabled: !isAuthenticated
    }
  ]

  const { theme, setTheme } = useTheme()

  const navSecondaryData = [
    {
      title: 'Github',
      onClick: () => {
        window.location.replace('https://github.com/EvaLLLLL/vmemo')
      },
      icon: Github
    },
    {
      title: 'Toggle theme',
      onClick: () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
      },
      icon: theme === 'light' ? SunIcon : MoonIcon
    }
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VMEMO</span>
                  <span className="truncate text-xs">v1.0.0-beta</span>
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
