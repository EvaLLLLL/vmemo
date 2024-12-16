import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Twitter from 'next-auth/providers/twitter'
import Discord from 'next-auth/providers/discord'
import prisma from '@/lib/prisma'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { Adapter } from 'next-auth/adapters'

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, user }) {
      session.userId = user?.id
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user?.id // Add user ID to token
      }
      return token
    }
  },
  providers: [
    Credentials({
      credentials: {
        name: {},
        email: {}
      },
      authorize: async (credentials) => {
        if (
          credentials?.email !== 'test@vmemo.com' ||
          credentials?.name !== 'test@vmemo.com'
        ) {
          return null
        }

        const user = await prisma.user.upsert({
          where: { email: 'test@vmemo.com' },
          update: { email: 'test@vmemo.com', name: 'test@vmemo.com' },
          create: { email: 'test@vmemo.com', name: 'test@vmemo.com' }
        })

        return user
      }
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true
    }),
    Google({
      allowDangerousEmailAccountLinking: true
    }),
    Twitter({
      allowDangerousEmailAccountLinking: true
    }),
    Discord({
      allowDangerousEmailAccountLinking: true
    })
  ],
  adapter: PrismaAdapter(prisma) as Adapter
})

export async function checkAuth() {
  const session = await auth()

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: session?.user?.email as string },
        { name: session?.user?.name as string }
      ]
    }
  })

  return user
}
