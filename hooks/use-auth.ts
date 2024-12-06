import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthServices } from '@/lib/services'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    data: userResponse,
    isLoading: isLoaidngUser,
    refetch: refetchUser
  } = useQuery({
    queryKey: [AuthServices.getUser.key],
    queryFn: AuthServices.getUser.fn,
    retry: false,
    throwOnError: false
  })

  const { mutateAsync: signup, isPending: isSigningUp } = useMutation({
    mutationKey: [AuthServices.signUp.key],
    mutationFn: AuthServices.signUp.fn,
    onSuccess: () => refetchUser()
  })

  const { mutateAsync: signin, isPending: isSigningIn } = useMutation({
    mutationKey: [AuthServices.signIn.key],
    mutationFn: AuthServices.signIn.fn,
    onSuccess: async () => {
      await refetchUser()
      router.replace('/')
    }
  })

  const { mutateAsync: logout, isPending: isLogingOut } = useMutation({
    mutationKey: [AuthServices.logOut.key],
    mutationFn: AuthServices.logOut.fn,
    onSuccess: () => {
      queryClient.clear()
      router.replace('/login')
    }
  })

  const user = useMemo(() => userResponse?.data, [userResponse?.data])
  const isAuthenticated = useMemo(() => !!user?.name, [user?.name])
  const isLoading = useMemo(
    () => isLoaidngUser || isSigningIn || isSigningUp || isLogingOut,
    [isLoaidngUser, isSigningIn, isLogingOut, isSigningUp]
  )

  return {
    isAuthenticated,
    isLoading,
    user,
    signup,
    signin,
    logout
  }
}
