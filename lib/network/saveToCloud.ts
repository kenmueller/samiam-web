'use server'

import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { nanoid } from 'nanoid'

import Network from '.'
import admin from '../firebase/admin'
import getCurrentUser from '../user/getCurrent'

const firestore = getFirestore(admin)
const storage = getStorage(admin).bucket()

const contentType = 'application/json'

export const saveNewNetworkToCloud = async (network: Network) => {
	const user = await getCurrentUser()
	if (!user) throw new Error('Not signed in')

	const id = nanoid()

	await Promise.all([
		firestore.doc(`networks/${encodeURIComponent(id)}`).create({
			name: network.name,
			archived: false,
			user: user.id
		}),
		storage
			.file(`networks/${encodeURIComponent(id)}`)
			.save(JSON.stringify(network), {
				gzip: true,
				contentType,
				metadata: { contentType }
			})
	])

	return id
}

export const saveExistingNetworkToCloud = async (
	id: string,
	network: Network
) => {
	const user = await getCurrentUser()
	if (!user) throw new Error('Not signed in')

	const snapshot = await firestore
		.doc(`networks/${encodeURIComponent(id)}`)
		.get()

	if (!snapshot.exists) throw new Error('Network does not exist')
	if (snapshot.get('user') !== user.id)
		throw new Error('You do not own this network')

	await Promise.all([
		firestore.doc(`networks/${encodeURIComponent(id)}`).update({
			name: network.name
		}),
		storage
			.file(`networks/${encodeURIComponent(id)}`)
			.save(JSON.stringify(network), {
				gzip: true,
				contentType,
				metadata: { contentType }
			})
	])
}
