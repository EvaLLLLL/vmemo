import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { AuthServices } from '@/lib/services'

export function useAuth() {
  const { status } = useSession()

  const { data: user, isLoading } = useQuery({
    queryKey: [AuthServices.getUser.key],
    queryFn: AuthServices.getUser.fn,
    select: (data) => data.data
  })

  const isAuthenticated = status === 'authenticated'

  return {
    isAuthenticated,
    isLoading,
    user
  }
}
