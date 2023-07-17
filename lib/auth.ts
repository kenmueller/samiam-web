if (!process.env.GOOGLE_CLIENT_ID) throw new Error('Missing GOOGLE_CLIENT_ID')
if (!process.env.GOOGLE_CLIENT_SECRET)
	throw new Error('Missing GOOGLE_CLIENT_SECRET')

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { FirestoreAdapter } from '@next-auth/firebase-adapter'
import { getFirestore } from 'firebase-admin/firestore'

import admin from './firebase/admin'

const firestore = getFirestore(admin)

const auth = NextAuth({
	adapter: FirestoreAdapter(firestore),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET
		})
	]
})

export default auth
