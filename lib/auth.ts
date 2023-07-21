if (!process.env.GOOGLE_CLIENT_ID) throw new Error('Missing GOOGLE_CLIENT_ID')
if (!process.env.GOOGLE_CLIENT_SECRET)
	throw new Error('Missing GOOGLE_CLIENT_SECRET')

import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { FirestoreAdapter } from '@next-auth/firebase-adapter'
import { getFirestore } from 'firebase-admin/firestore'

import admin from './firebase/admin'
import User from './user'

const firestore = getFirestore(admin)

const authOptions: AuthOptions = {
	adapter: FirestoreAdapter(firestore),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET
		})
	],
	callbacks: {
		session: params => {
			const sessionUser = params.session.user as User

			sessionUser.id = params.user.id

			return params.session
		}
	}
}

export default authOptions
