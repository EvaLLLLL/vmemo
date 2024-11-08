'use client'

import { useAuth } from '@/hooks/useAuth'
import cn from '@/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const { user, signin, logout, isAuthenticated } = useAuth()
  return (
    <div className="relative">
      <div className="flex h-16 shrink-0 items-center justify-center gap-4 border">
        <NavigateItem label="home" path="/" />
        <div className="h-1/2 w-0.5 rounded-full bg-slate-100" />
        <NavigateItem label="reading" path="/reading" />
        <div className="h-1/2 w-0.5 rounded-full bg-slate-100" />
        <NavigateItem label="vocabulary" path="/vocabulary" />
        <div className="h-1/2 w-0.5 rounded-full bg-slate-100" />
        <NavigateItem label="dictionary" path="/ecdict" />
      </div>

      <div className="absolute right-12 top-1/2 flex -translate-y-1/2 items-center gap-x-4">
        {!isAuthenticated ? (
          <button
            onClick={() => signin({ name: '444', password: '444' })}
            className="rounded-md bg-slate-500 p-2 font-bold text-white">
            signin
          </button>
        ) : (
          <>
            <div className="flex aspect-square h-12 items-center justify-center rounded-full bg-pink-400 font-bold text-white">
              {user?.name}
            </div>
            <button
              onClick={() => logout()}
              className="rounded-md bg-slate-500 p-2 font-bold text-white">
              logout
            </button>
          </>
        )}
      </div>
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
