import { useSession } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const user = session?.user

  return {
    isAuthenticated,
    isLoading,
    user
  }
}
