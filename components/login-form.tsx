'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const { signin, isLoading } = useAuth()

  const [data, setData] = useState({
    name: '',
    password: ''
  })

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            onClick={() => signin(data)}>
            <Loader2 className={cn(isLoading ? 'animate-spin' : 'hidden')} />
            Login
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
