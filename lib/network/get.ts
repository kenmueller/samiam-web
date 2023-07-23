import { getStorage } from 'firebase-admin/storage'

import admin from '../firebase/admin'
import Network from '.'

const storage = getStorage(admin).bucket()

const getNetwork = async (id: string) => {
	try {
		const [data] = await storage
			.file(`networks/${encodeURIComponent(id)}`)
			.download()

		const network = JSON.parse(data.toString()) as Network

		return network
	} catch (error) {
		if ((error as { code: number }).code === 404) return null
		throw error
	}
}

export default getNetwork
