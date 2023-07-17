import NextAuth from 'next-auth'

import authOptions from '@/lib/auth'

const authHandler = NextAuth(authOptions)

export const GET = authHandler
export const POST = authHandler
