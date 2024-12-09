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
  debug: true,
  session: { strategy: 'jwt' },
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

        const user = await prisma.user.findUnique({
          where: { email: 'test@vmemo.com' }
        })

        if (!user) {
          return null
        }

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
