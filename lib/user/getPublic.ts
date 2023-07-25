import { getFirestore } from 'firebase-admin/firestore'
import { cache } from 'react'

import admin from '../firebase/admin'
import { PublicUser } from '.'

const firestore = getFirestore(admin)

const getPublicUser = cache(async (id: string) => {
	const snapshot = await firestore.doc(`users/${encodeURIComponent(id)}`).get()
	if (!snapshot.exists) return null

	return {
		id: snapshot.id,
		image: snapshot.get('image'),
		name: snapshot.get('name')
	} as PublicUser
})

export default getPublicUser
