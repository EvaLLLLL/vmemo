import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Squirrel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/next-auth'
import { DiscordIcon, GithubIcon, GoogleIcon, TwitterIcon } from '@/icons'

export default function Page() {
  return (
    <div className="flex size-full flex-col items-center gap-y-8 overflow-y-auto p-8">
      <div className="rounded-md p-4 text-center text-muted-foreground">
        <p className="text-lg font-semibold">Note:</p>
        <p className="mt-2">
          You can still use the <span className="text-primary">dictionary</span>{' '}
          and <span className="text-primary">reading</span> sections without
          logging in.
        </p>
      </div>

      <div>
        <form
          action={async (_) => {
            'use server'
            await signIn('credentials', {
              name: 'test@vmemo.com',
              email: 'test@vmemo.com',
              redirectTo: '/refresh'
            })
          }}>
          <Button type="submit" variant="outline" className="w-full">
            Login as Test User
            <Squirrel className="size-6" />
          </Button>
        </form>
      </div>

      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Select a provider to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form
              action={async () => {
                'use server'
                await signIn('github', { redirectTo: '/refresh' })
              }}>
              <Button type="submit" variant="outline" className="w-full">
                Login with Github
                <GithubIcon />
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('google', { redirectTo: '/refresh' })
              }}>
              <Button type="submit" variant="outline" className="w-full">
                Login with Google
                <GoogleIcon />
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('twitter', { redirectTo: '/refresh' })
              }}>
              <Button type="submit" variant="outline" className="w-full">
                Login with Twitter
                <TwitterIcon />
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('discord', { redirectTo: '/refresh' })
              }}>
              <Button type="submit" variant="outline" className="w-full">
                Login with Discord
                <DiscordIcon />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
