import { useQuery } from '@tanstack/react-query'
import { signOut, useSession } from 'next-auth/react'
import { AuthServices } from '@/lib/services'
import { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { protectedRoutes } from '@/config/routes'

export function useAuth() {
  const { status } = useSession()
  const pathname = usePathname()

  const { data, isLoading, isError, isPending } = useQuery({
    queryKey: [AuthServices.getUser.key],
    queryFn: AuthServices.getUser.fn,
    retry: false
  })

  useEffect(() => {
    if (
      isError &&
      !isLoading &&
      !isPending &&
      protectedRoutes.includes(pathname)
    ) {
      signOut({ redirectTo: '/refresh' })
    }
  }, [isError, isLoading, isPending, pathname])

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
