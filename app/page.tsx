'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, signin, signup, logout } = useAuth()

  return (
    <div className="flex size-full flex-col items-center justify-center gap-8">
      <button className="w-48 cursor-pointer rounded-xl bg-purple-200 p-2 hover:bg-purple-500">
        <Link href="/reading">reading</Link>
      </button>
      <button className="w-48 cursor-pointer rounded-xl bg-purple-200 p-2 hover:bg-purple-500">
        <Link href="/vocabulary">vocabulary</Link>
      </button>
      <button className="w-48 cursor-pointer rounded-xl bg-purple-200 p-2 hover:bg-purple-500">
        <Link href="/ecdict">dictionary</Link>
      </button>

      <div className="flex items-center justify-center gap-8">
        <div>name: {user?.name}</div>
        <div>email: {user?.email}</div>
      </div>

      <button
        onClick={() =>
          signup({ name: '333', password: '333', email: '4444@444.com' })
        }>
        signup
      </button>
      <button
        onClick={() =>
          signin({
            name: '444',
            password: '444'
          })
        }>
        signin
      </button>
      <button onClick={() => logout()}>logout</button>
    </div>
  )
}
