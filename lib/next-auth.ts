import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Twitter from 'next-auth/providers/twitter'
import Discord from 'next-auth/providers/discord'
import prisma from '@/lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
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
  adapter: PrismaAdapter(prisma)
})
