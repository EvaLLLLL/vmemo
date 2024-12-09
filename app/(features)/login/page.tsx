import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/next-auth'
import Image from 'next/image'

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

      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Select a provider to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* <form
              action={async (formData) => {
                'use server'
                await signIn('resend', formData)
              }}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="text"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <Button type="submit" variant="default" className="mt-4 w-full">
                Login with Email
              </Button>
            </form> */}
            <form
              action={async () => {
                'use server'
                await signIn('github', { redirectTo: '/' })
              }}>
              <Button type="submit" variant="outline" className="w-full">
                Login with Github
                <Image src="/github.svg" width={20} height={20} alt="Github" />
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('google', { redirectTo: '/' })
              }}>
              <Button type="submit" variant="outline" className="w-full">
                Login with Google
                <Image src="/google.svg" width={20} height={20} alt="Google" />
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('twitter', { redirectTo: '/' })
              }}>
              <Button type="submit" variant="outline" className="w-full">
                Login with Twitter
                <Image
                  src="/twitter.svg"
                  width={20}
                  height={20}
                  alt="Twitter"
                />
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('discord', { redirectTo: '/' })
              }}>
              <Button type="submit" variant="outline" className="w-full">
                Login with Discord
                <Image
                  src="/discord.svg"
                  width={20}
                  height={20}
                  alt="Discord"
                />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
