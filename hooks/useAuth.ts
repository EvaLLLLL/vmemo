import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthServices } from '@/lib/services'

export function useAuth() {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading: isLoaidngUser,
    refetch: refetchUser
  } = useQuery({
    queryKey: [AuthServices.getUser.key],
    queryFn: AuthServices.getUser.fn,
    retry: false
  })

  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationKey: [AuthServices.signUp.key],
    mutationFn: AuthServices.signUp.fn,
    onSuccess: () => refetchUser()
  })

  const { mutate: signin, isPending: isSigningIn } = useMutation({
    mutationKey: [AuthServices.signIn.key],
    mutationFn: AuthServices.signIn.fn,
    onSuccess: () => refetchUser()
  })

  const { mutate: logout, isPending: isLogingOut } = useMutation({
    mutationKey: [AuthServices.logOut.key],
    mutationFn: AuthServices.logOut.fn,
    onSuccess: () => {
      queryClient.clear()
      queryClient.setQueryData([AuthServices.getUser.key], null)
    }
  })

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
