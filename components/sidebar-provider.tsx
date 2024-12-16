'use client'

import {
  SidebarProvider as SidebarProviderComponent,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar'
import {
  BreadcrumbLink,
  BreadcrumbList,
  Breadcrumb,
  BreadcrumbItem
} from '@/components/ui/breadcrumb'

import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@radix-ui/react-separator'
import { useParams, usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { useChatRooms } from '@/hooks/use-chat-rooms'

export const SidebarProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const params = useParams()
  const roomId = params.roomId as string
  const { room } = useChatRooms(roomId)

  const breadLabel = useMemo(() => {
    switch (pathname) {
      case '/':
        return 'Dashboard'
      case `/community/${roomId}`:
        return room?.name ? `Community / ${room?.name}` : 'Community'
      default:
        return pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)
    }
  }, [pathname, room?.name, roomId])

  return (
    <SidebarProviderComponent>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>{breadLabel}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProviderComponent>
  )
}
