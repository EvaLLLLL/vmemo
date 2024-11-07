'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {

  const { user, signin, signup, signout } = useAuth()

  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-8'>
      <button className='p-2 bg-purple-200 w-48 rounded-xl hover:bg-purple-500 cursor-pointer'>
        <Link href="/reading">reading</Link>
      </button>
      <button className='p-2 bg-purple-200 w-48 rounded-xl hover:bg-purple-500 cursor-pointer'>
        <Link href="/vocabulary">vocabulary</Link>
      </button>
      <button className='p-2 bg-purple-200 w-48 rounded-xl hover:bg-purple-500 cursor-pointer'>
        <Link href="/ecdict">dictionary</Link>
      </button>


      <div className='flex items-center justify-center gap-8'>
        <div>name: {user?.name}</div>
        <div>email: {user?.email}</div>
      </div>

      <button onClick={() => signup()}>signup</button>
      <button onClick={() => signin()}>signin</button>
      <button onClick={() => signout()}>signout</button>
    </div>
  )
}
