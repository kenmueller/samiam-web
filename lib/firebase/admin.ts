import 'server-only'

if (!process.env.FIREBASE_ADMIN_KEY)
	throw new Error('Missing FIREBASE_ADMIN_KEY')
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')

import { getApps, initializeApp, cert } from 'firebase-admin/app'

const admin =
	getApps()[0] ??
	initializeApp({
		credential: cert(
			JSON.parse(
				Buffer.from(process.env.FIREBASE_ADMIN_KEY, 'base64').toString()
			)
		),
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
	})

export default admin
