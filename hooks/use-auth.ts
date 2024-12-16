import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { AuthServices } from '@/lib/services'
import { useMemo } from 'react'

export function useAuth() {
  const { status } = useSession()

  const { data, isLoading } = useQuery({
    queryKey: [AuthServices.getUser.key],
    queryFn: AuthServices.getUser.fn
  })

  const isAuthenticated = useMemo(() => status === 'authenticated', [status])
  const user = useMemo(
    () => (isAuthenticated ? data?.data : null),
    [isAuthenticated, data]
  )

  return {
    isAuthenticated,
    isLoading,
    user
  }
}
