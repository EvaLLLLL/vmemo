import Link from 'next/link'
import Reading from './reading/page'

export default function Home() {

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
    </div>
  )
}
