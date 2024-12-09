'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { usePosts } from '@/hooks/use-posts'

export function PostForm() {
  const { toast } = useToast()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createPost } = usePosts()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    try {
      setIsSubmitting(true)
      await createPost({ content: message })
      toast({
        title: 'Success',
        description: 'Post created successfully!'
      })
    } catch (_err) {
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write your post..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Create Post'}
      </Button>
    </form>
  )
}
