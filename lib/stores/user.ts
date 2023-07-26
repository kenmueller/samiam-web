import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import User from '@/lib/user'
import { NetworkMeta } from '../network'
import getNetworksByUser from '../network/getByUser'

export interface UserStore {
	user: User | null
	setUser: (user: User | null) => void

	networks: NetworkMeta[] | null
	getNetworks: () => Promise<NetworkMeta[]>
}

const useUserStore = create(
	immer<UserStore>((set, get) => ({
		user: null,
		setUser: user => {
			set(state => {
				state.user = user
			})
		},

		networks: null,
		getNetworks: async () => {
			const { user } = get()
			if (!user) throw new Error('Not signed in')

			const networks = await getNetworksByUser(user.id)

			set(state => {
				state.networks = networks
			})

			return networks
		}
	}))
)

export default useUserStore
