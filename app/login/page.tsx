import { LoginForm } from '@/components/login-form'
import { Terminal } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Page() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-8 px-4">
      <Alert className="mx-auto max-w-md">
        <div className="flex items-center gap-x-2 font-bold text-red-400">
          <Terminal className="size-4" />
          <AlertTitle className="font-bold">Heads up!</AlertTitle>
        </div>

        <div className="font-bold text-gray-500">
          <AlertDescription>
            The product is still under development. Please use the following
            test account to access all features.
          </AlertDescription>

          <div className="mt-6">
            <AlertDescription>Email: test@vmemo.com</AlertDescription>
            <AlertDescription>Password: test@vmemo.com</AlertDescription>
          </div>
        </div>
      </Alert>
      <LoginForm />
    </div>
  )
}
