import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { castDraft } from 'immer'

import Network, { NetworkMeta } from '@/lib/network'
import { NetworkAction, initializeBeliefNetwork } from '@/lib/network/actions'
import saveNetworkToStorage from '@/lib/network/saveToStorage'
import BeliefNetworkWithNodeMap from '@/lib/beliefNetwork/withNodeMap'
import networkToLatex from '../network/toLatex'
import useUserStore from './user'
import {
	saveNewNetworkToCloud,
	saveExistingNetworkToCloud
} from '../network/saveToCloud'

export interface NetworkStore {
	meta: NetworkMeta | null
	network: Network
	beliefNetwork: BeliefNetworkWithNodeMap
	setNetwork: (meta: NetworkMeta, network: Network) => void
	loadNetworkFromStorage: () => void
	loadNetworkFromFile: () => Promise<void>
	saveNetworkToFile: () => Promise<void>
	saveNewNetworkToCloud: () => Promise<string>
	saveExistingNetworkToCloud: () => Promise<void>
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
		meta: null,
		network: EMPTY_NETWORK,
		beliefNetwork: initializeBeliefNetwork(EMPTY_NETWORK),
		setNetwork: (meta, network) => {
			set(state => {
				state.meta = meta
				state.network = network
				state.beliefNetwork = castDraft(initializeBeliefNetwork(state.network))
			})
		},
		loadNetworkFromStorage: () => {
			const networkString = localStorage.getItem('network')
			if (!networkString) return

			set(state => {
				state.meta = null
				state.network = JSON.parse(networkString) as Network
				state.beliefNetwork = castDraft(initializeBeliefNetwork(state.network))
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
				state.meta = null
				state.network = network
				state.beliefNetwork = castDraft(initializeBeliefNetwork(state.network))
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
		saveNewNetworkToCloud: async () => {
			const { network } = get()
			return await saveNewNetworkToCloud(network)
		},
		saveExistingNetworkToCloud: async () => {
			const { meta, network } = get()
			if (!meta) throw new Error('Network does not exist')

			await saveExistingNetworkToCloud(meta.id, network)
		},
		getNetworkAsLatex: () => networkToLatex(get().network),
		clearNetworkFromStorage: () => {
			set(state => {
				state.meta = null
				state.network = EMPTY_NETWORK
				state.beliefNetwork = castDraft(initializeBeliefNetwork(state.network))
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
