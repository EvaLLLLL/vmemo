'use client'

import cn from '@/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  return (
    <div className="flex h-16 shrink-0 items-center justify-center gap-4">
      <NavigateItem label="home" path="/" />
      <div className="h-1/2 w-0.5 rounded-full bg-slate-100" />
      <NavigateItem label="reading" path="/reading" />
      <div className="h-1/2 w-0.5 rounded-full bg-slate-100" />
      <NavigateItem label="vocabulary" path="/vocabulary" />
      <div className="h-1/2 w-0.5 rounded-full bg-slate-100" />
      <NavigateItem label="dictionary" path="/ecdict" />
    </div>
  )
}

const NavigateItem: React.FC<{
  label: string
  path: string
}> = ({ label, path }) => {
  const pathname = usePathname()
  return (
    <button
      className={cn(
        'p-2 rounded-xl hover:bg-slate-100 cursor-pointer',
        pathname === path && 'bg-slate-100'
      )}>
      <Link href={path}>{label.toUpperCase()}</Link>
    </button>
  )
}
