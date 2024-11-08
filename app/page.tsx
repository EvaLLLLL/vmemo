'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, signin, signup, signout } = useAuth()

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

      <button onClick={() => signup()}>signup</button>
      <button onClick={() => signin()}>signin</button>
      <button onClick={() => signout()}>signout</button>
    </div>
  )
}
