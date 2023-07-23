'use server'

import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { nanoid } from 'nanoid'

import Network from '.'
import User from '../user'
import admin from '../firebase/admin'

const firestore = getFirestore(admin)
const storage = getStorage(admin).bucket()

const contentType = 'application/json'

const saveNetworkToCloud = async (user: User, network: Network) => {
	const id = nanoid()

	await Promise.all([
		firestore.doc(`networks/${encodeURIComponent(id)}`).create({
			name: network.name,
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

export default saveNetworkToCloud
