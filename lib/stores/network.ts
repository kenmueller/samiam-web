import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import Network, { Position, Edge } from '@/lib/network'
import getNextNodeId from '@/lib/network/getNextNodeId'
import saveNetworkToStorage from '@/lib/network/saveToStorage'

export interface NetworkStore {
	network: Network
	loadNetworkFromStorage: () => void
	loadNetworkFromFile: () => Promise<void>
	saveNetworkToFile: () => Promise<void>
	addNode: (position: Position) => void
	setNodePosition: (id: number, position: Position) => void
	removeNode: (id: number) => void
	addEdge: (edge: Edge) => void
	removeEdge: (edge: Edge) => void
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

			saveNetworkToStorage(network)
		},
		saveNetworkToFile: async () => {
			const { default: saveAs } = await import('file-saver')

			const file = new Blob([JSON.stringify(get().network)], {
				type: 'application/json; charset=utf-8'
			})

			saveAs(file, 'network.json')
		},
		addNode: (position: Position) => {
			set(state => {
				state.network.nodes.push({
					id: getNextNodeId(state.network.nodes),
					name: 'Node',
					...position
				})
			})

			saveNetworkToStorage(get().network)
		},
		setNodePosition: (id, position) => {
			set(state => {
				const node = state.network.nodes.find(node => node.id === id)
				if (!node) return

				Object.assign(node, position)
			})
		},
		removeNode: id => {
			set(state => {
				const index = state.network.nodes.findIndex(node => node.id === id)
				if (index < 0) return

				state.network.nodes.splice(index, 1)
				state.network.edges = state.network.edges.filter(
					edge => !(edge.from === id || edge.to === id)
				)
			})
		},
		addEdge: edge => {
			set(state => {
				if (edge.from === edge.to)
					throw new Error('Cannot connect node to itself')

				if (
					state.network.edges.some(
						otherEdge =>
							otherEdge.from === edge.from && otherEdge.to === edge.to
					)
				)
					throw new Error('Edge already exists')

				state.network.edges.push(edge)
			})
		},
		removeEdge: ({ from, to }) => {
			set(state => {
				const index = state.network.edges.findIndex(
					edge => edge.from === from && edge.to === to
				)
				if (index < 0) return

				state.network.edges.splice(index, 1)
			})
		}
	}))
)

export default useNetworkStore
