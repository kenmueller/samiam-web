import { cache } from 'react'
import { getFirestore } from 'firebase-admin/firestore'

import admin from '../firebase/admin'
import { NetworkMeta } from '.'

export const revalidate = 3600

const firestore = getFirestore(admin)

const getArchivedNetworks = cache(async () => {
	const { docs } = await firestore
		.collection('networks')
		.where('archived', '==', true)
		.get()

	return docs.map(
		snapshot => ({ id: snapshot.id, ...snapshot.data() }) as NetworkMeta
	)
})

export default getArchivedNetworks
