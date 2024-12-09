'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'
import { PostForm } from './components/post-form'
import { usePosts } from '@/hooks/use-posts'

export default function Page() {
  const { posts, canPost, myLikedPostIds, likeTogglePost } = usePosts()

  const randomBorderColor = (n: number) => {
    return {
      1: 'border-borderPost-1',
      2: 'border-borderPost-2',
      3: 'border-borderPost-3',
      4: 'border-borderPost-4',
      5: 'border-borderPost-5'
    }[n]
  }

  return (
    <div className="container mx-auto overflow-y-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Post Wall</h1>
      <div className="space-y-8">
        {canPost && <PostForm />}

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {posts?.map((post) => (
            <div
              key={post.id}
              className={cn(
                'mb-4 break-inside-avoid rounded-lg border-2 bg-card p-4 shadow-xl',
                randomBorderColor(Math.floor(Math.random() * 5) + 1)
              )}>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {post.user.name}
                </p>
                <p className="mt-2">{post.content}</p>
              </div>
              <Button
                type="submit"
                variant="ghost"
                onClick={() => likeTogglePost(post.id)}
                className="mt-2 flex items-center space-x-1">
                <Heart
                  className={cn(
                    'h-5 w-5',
                    myLikedPostIds.has(post.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                  )}
                />
                <span className="text-sm">{post.likes.length}</span>
              </Button>
              <p className="mt-2 text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
