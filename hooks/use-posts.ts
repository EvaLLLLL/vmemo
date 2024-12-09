import { PostsServices } from '@/lib/services'
import { useMutation, useQuery } from '@tanstack/react-query'

export function usePosts() {
  const {
    data: posts,
    isLoading: isLoadingAllPosts,
    refetch: refetchAllPosts
  } = useQuery({
    queryKey: [PostsServices.getPosts.key],
    queryFn: PostsServices.getPosts.fn,
    select: (data) => data.data
  })

  const {
    data: myTodayPosts,
    isLoading: myTodayPostsLoading,
    refetch: refetchMyTodayPosts
  } = useQuery({
    queryKey: [PostsServices.getMyTodayPosts.key],
    queryFn: PostsServices.getMyTodayPosts.fn,
    select: (data) => data.data
  })

  const canPost = (myTodayPosts?.length || 0) < 3

  const {
    data: myLikes,
    isLoading: isLoadingLikes,
    refetch: refetchMyLikes
  } = useQuery({
    queryKey: [PostsServices.getLikes.key],
    queryFn: PostsServices.getLikes.fn,
    select: (data) => data.data
  })

  const { mutate: createPost } = useMutation({
    mutationKey: [PostsServices.createPost.key],
    mutationFn: PostsServices.createPost.fn,
    onSuccess: () => {
      refetchAllPosts()
      refetchMyTodayPosts()
      refetchMyLikes()
    }
  })

  const { mutate: likeTogglePost } = useMutation({
    mutationKey: [PostsServices.likeTogglePost.key],
    mutationFn: PostsServices.likeTogglePost.fn,
    onSuccess: () => {
      refetchAllPosts()
      refetchMyTodayPosts()
      refetchMyLikes()
    }
  })

  const myLikedPostIds = new Set(myLikes?.map((like) => like.postId) || [])

  const isLoading = isLoadingAllPosts || myTodayPostsLoading || isLoadingLikes

  return {
    posts,
    myTodayPosts,
    canPost,
    isLoading,
    myLikedPostIds,
    createPost,
    likeTogglePost
  }
}
