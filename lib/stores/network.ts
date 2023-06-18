import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import Network from '@/lib/network'
import { NetworkAction } from '@/lib/network/actions'
import saveNetworkToStorage from '@/lib/network/saveToStorage'

export interface NetworkStore {
	network: Network
	loadNetworkFromStorage: () => void
	loadNetworkFromFile: () => Promise<void>
	saveNetworkToFile: () => Promise<void>
	applyAction: (action: NetworkAction) => void
}

const useNetworkStore = create(
	immer<NetworkStore>((set, get) => ({
		network: { nodes: {} },
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

			saveNetworkToStorage(network)
		},
		saveNetworkToFile: async () => {
			const { default: saveAs } = await import('file-saver')

			const file = new Blob([JSON.stringify(get().network)], {
				type: 'application/json; charset=utf-8'
			})

			saveAs(file, 'network.json')
		},
		applyAction: action => {
			set(state => {
				action(state.network)
			})

			saveNetworkToStorage(get().network)
		}
		// setNodeName: (id, name) => {
		// 	set(state => {
		// 		const node = state.network.nodes.find(node => node.id === id)
		// 		if (!node) return

		// 		node.name = name
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// setNodeValue: (id, valueIndex, value) => {
		// 	set(state => {
		// 		const node = state.network.nodes.find(node => node.id === id)
		// 		if (!node) return

		// 		node.values[valueIndex] = value
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// addNodeValue: id => {
		// 	set(state => {
		// 		const node = state.network.nodes.find(node => node.id === id)
		// 		if (!node) return

		// 		const cptValues = (node.cpt[0] as number[] | undefined)?.length
		// 		if (cptValues === undefined) throw new Error('CPT is empty')

		// 		node.values.push(`value${node.values.length}`)
		// 		node.cpt.push(new Array(cptValues).fill(0))
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// removeNodeValue: (id, valueIndex) => {
		// 	set(state => {
		// 		const node = state.network.nodes.find(node => node.id === id)
		// 		if (!node) return

		// 		node.values.splice(valueIndex, 1)
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// setNodeCptValue: (id, valueIndex, columnIndex, value) => {
		// 	set(state => {
		// 		const node = state.network.nodes.find(node => node.id === id)
		// 		if (!node) return

		// 		node.cpt[valueIndex][columnIndex] = value
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// setNodePosition: (id, position) => {
		// 	set(state => {
		// 		const node = state.network.nodes.find(node => node.id === id)
		// 		if (!node) return

		// 		node.x = position.x
		// 		node.y = position.y
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// snapNodeToGrid: id => {
		// 	set(state => {
		// 		const node = state.network.nodes.find(node => node.id === id)
		// 		if (!node) return

		// 		node.x = Math.round(node.x / GRID_SPACING_X) * GRID_SPACING_X
		// 		node.y = Math.round(node.y / GRID_SPACING_Y) * GRID_SPACING_Y
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// removeNode: id => {
		// 	set(state => {
		// 		const index = state.network.nodes.findIndex(node => node.id === id)
		// 		if (index < 0) return

		// 		state.network.nodes.splice(index, 1)

		// 		for (const otherNode of state.network.nodes) {
		// 			otherNode.parents = otherNode.parents.filter(
		// 				parentId => parentId !== id
		// 			)
		// 		}
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// addEdge: edge => {
		// 	set(state => {
		// 		if (edge.from === edge.to)
		// 			throw new Error('Cannot connect node to itself')

		// 		const parent = state.network.nodes.find(node => node.id === edge.from)
		// 		if (!parent) return

		// 		const child = state.network.nodes.find(node => node.id === edge.to)
		// 		if (!child) return

		// 		if (child.parents.includes(parent.id))
		// 			throw new Error('Edge already exists')

		// 		child.parents.push(parent.id)

		// 		child.cpt = child.cpt.map(row =>
		// 			new Array(parent.values.length).fill(row).flat()
		// 		)
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// removeEdge: edge => {
		// 	set(state => {
		// 		const child = state.network.nodes.find(node => node.id === edge.to)
		// 		if (!child) return

		// 		const parentIndex = child.parents.findIndex(id => id === edge.from)
		// 		if (parentIndex < 0) return

		// 		child.parents.splice(parentIndex, 1)
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },

		// setAssertionType: (id, type) => {
		// 	set(state => {
		// 		const node = state.network.nodes.find(node => node.id === id)
		// 		if (!node) return

		// 		node.assertionType = type ?? undefined
		// 	})

		// 	saveNetworkToStorage(get().network)
		// },
		// setAssertedValue: (id, valueIndex) => {
		// 	set(state => {
		// 		const node = state.network.nodes.find(node => node.id === id)
		// 		if (!node) return

		// 		node.assertedValue = valueIndex ?? undefined
		// 	})

		// 	saveNetworkToStorage(get().network)
		// }
	}))
)

export default useNetworkStore
