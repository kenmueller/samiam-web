import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { cache } from 'react'

import admin from '../firebase/admin'
import Network, { NetworkMeta } from '.'

const firestore = getFirestore(admin)
const storage = getStorage(admin).bucket()

const getNetwork = cache(async (id: string) => {
	try {
		const [meta, network] = await Promise.all([
			(async () => {
				const snapshot = await firestore
					.doc(`networks/${encodeURIComponent(id)}`)
					.get()
				if (!snapshot.exists) throw { code: 404 }

				return { id: snapshot.id, ...snapshot.data() } as NetworkMeta
			})(),
			(async () => {
				const [data] = await storage
					.file(`networks/${encodeURIComponent(id)}`)
					.download()

				const network = JSON.parse(data.toString()) as Network

				return network
			})()
		])

		return { meta, network }
	} catch (error) {
		if ((error as { code: number }).code === 404) return null
		throw error
	}
})

export default getNetwork
