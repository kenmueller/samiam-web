'use server'

import { getFirestore } from 'firebase-admin/firestore'

import admin from '../firebase/admin'
import { NetworkMeta } from '.'

const firestore = getFirestore(admin)

const getNetworksByUser = async (id: string) => {
	const { docs } = await firestore
		.collection('networks')
		.where('user', '==', id)
		.get()

	return docs.map(
		snapshot => ({ id: snapshot.id, ...snapshot.data() }) as NetworkMeta
	)
}

export default getNetworksByUser
