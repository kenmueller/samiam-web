import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import Network from '@/lib/network'
import getNextNodeId from '@/lib/network/getNextNodeId'
import saveNetworkToStorage from '@/lib/network/saveToStorage'

export interface NetworkStore {
	network: Network
	loadNetworkFromStorage: () => void
	loadNetworkFromFile: () => Promise<void>
	saveNetworkToFile: () => Promise<void>
	addNode: () => void
}

const useNetworkStore = create(
	immer<NetworkStore>((set, get) => ({
		network: {
			nodes: [],
			edges: []
		},
		loadNetworkFromStorage: () => {
			const network = localStorage.getItem('network')
			if (!network) return

			set(state => {
				state.network = JSON.parse(network) as Network
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
			})
		},
		saveNetworkToFile: async () => {
			const { default: saveAs } = await import('file-saver')

			const file = new Blob([JSON.stringify(get().network)], {
				type: 'application/json; charset=utf-8'
			})

			saveAs(file, 'network.json')
		},
		addNode: () => {
			set(state => {
				state.network.nodes.push({
					id: getNextNodeId(state.network.nodes),
					x: 0,
					y: 0
				})
			})

			saveNetworkToStorage(get().network)
		}
	}))
)

export default useNetworkStore