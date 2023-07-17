import 'client-only'

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY')
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID')
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_APP_ID')
if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID)
	throw new Error('Missing NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID')

import { getApps, initializeApp } from 'firebase/app'

const app =
	getApps()[0] ??
	initializeApp({
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
		measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
	})

export default app
