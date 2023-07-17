import NextAuth from 'next-auth'
import { FirestoreAdapter } from '@next-auth/firebase-adapter'
import { getFirestore } from 'firebase-admin/firestore'

import admin from './firebase/admin'

const firestore = getFirestore(admin)

const auth = NextAuth({
	adapter: FirestoreAdapter(firestore),
	providers: []
})

export default auth
