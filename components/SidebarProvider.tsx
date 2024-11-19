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
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export const SidebarProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const breadLabel = useMemo(() => {
    switch (pathname) {
      case '/':
        return 'Dashboard'
      default:
        return pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)
    }
  }, [pathname])

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
