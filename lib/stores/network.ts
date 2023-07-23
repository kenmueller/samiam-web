import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import Network from '@/lib/network'
import { NetworkAction, initializeBeliefNetwork } from '@/lib/network/actions'
import saveNetworkToStorage from '@/lib/network/saveToStorage'
import BeliefNetworkWithNodeMap from '@/lib/beliefNetwork/withNodeMap'
import networkToLatex from '../network/toLatex'
import useUserStore from './user'
import saveNetworkToCloud from '../network/saveToCloud'

export interface NetworkStore {
	network: Network
	beliefNetwork: BeliefNetworkWithNodeMap
	loadNetworkFromStorage: () => void
	loadNetworkFromFile: () => Promise<void>
	saveNetworkToFile: () => Promise<void>
	saveNetworkToCloud: () => Promise<string>
	getNetworkAsLatex: () => string
	clearNetworkFromStorage: () => void
	applyAction: <ReturnType>(action: NetworkAction<ReturnType>) => ReturnType
}

const EMPTY_NETWORK: Network = {
	name: null,
	eliminationOrderHeuristic: 'min-fill',
	nodes: {}
}

const useNetworkStore = create(
	immer<NetworkStore>((set, get) => ({
		network: EMPTY_NETWORK,
		beliefNetwork: initializeBeliefNetwork(EMPTY_NETWORK),
		loadNetworkFromStorage: () => {
			const networkString = localStorage.getItem('network')
			if (!networkString) return

			set(state => {
				state.network = JSON.parse(networkString) as Network
				state.beliefNetwork = initializeBeliefNetwork(state.network)
			})
		},
		loadNetworkFromFile: async () => {
			const network = await new Promise<Network>((resolve, reject) => {
				const input = document.createElement('input')

				input.type = 'file'
				input.accept = 'application/json'

				input.addEventListener(
					'change',
					() => {
						const file = input.files?.[0]
						if (!file) return reject(new Error('No file selected'))

						const reader = new FileReader()

						reader.addEventListener(
							'load',
							() => {
								if (typeof reader.result !== 'string')
									return reject(new Error('File is not a string'))

								try {
									resolve(JSON.parse(reader.result) as Network)
								} catch (error) {
									reject(error)
								}
							},
							{ once: true }
						)

						reader.readAsText(file)
					},
					{ once: true }
				)

				input.click()
			})

			set(state => {
				state.network = network
				state.beliefNetwork = initializeBeliefNetwork(state.network)
			})

			saveNetworkToStorage(network)
		},
		saveNetworkToFile: async () => {
			const { default: saveAs } = await import('file-saver')

			const file = new Blob([JSON.stringify(get().network)], {
				type: 'application/json; charset=utf-8'
			})

			saveAs(file, 'network.json')
		},
		saveNetworkToCloud: async () => {
			const { user } = useUserStore.getState()
			if (!user) throw new Error('User is not logged in')

			const { network } = get()

			return await saveNetworkToCloud(user, network)
		},
		getNetworkAsLatex: () => networkToLatex(get().network),
		clearNetworkFromStorage: () => {
			set(state => {
				state.network = EMPTY_NETWORK
				state.beliefNetwork = initializeBeliefNetwork(state.network)
			})

			saveNetworkToStorage(get().network)
		},
		applyAction: <ReturnType>(action: NetworkAction<ReturnType>) => {
			let returnValue: ReturnType

			const { beliefNetwork } = get()

			set(state => {
				returnValue = action(state.network, beliefNetwork)
			})

			saveNetworkToStorage(get().network)

			return returnValue!
		}
	}))
)

export default useNetworkStore
