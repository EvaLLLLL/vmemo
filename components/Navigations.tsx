'use client'

import cn from '@/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigations() {
  return (
    <div className="h-16 gap-4 flex items-center justify-center shrink-0">
      {/* <NavigateItem label="vocabulary" path="/" />
      <div className="h-1/2 w-0.5 bg-slate-100 rounded-full" /> */}
      <NavigateItem label="reading" path="/reading" />
    </div>
  )
}

const NavigateItem: React.FC<{
  label: string
  path: string
}> = ({ label, path }) => {
  const pathname = usePathname()
  return (
    <div
      className={cn(
        'p-2 rounded-xl hover:bg-slate-100 cursor-pointer',
        pathname === path && 'bg-slate-100'
      )}>
      <Link href={path}>{label.toUpperCase()}</Link>
    </div>
  )
}
