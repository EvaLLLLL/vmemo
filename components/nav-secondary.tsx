'use client'

import * as React from 'react'
import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useHasMounted } from '@/hooks/useHasMounted'

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    icon: LucideIcon
    onClick: () => void
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const hasMounted = useHasMounted()

  if (!hasMounted) return null

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton size="sm" onClick={item.onClick}>
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
