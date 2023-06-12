import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import Network, { Position, Edge } from '@/lib/network'
import getNextNodeId from '@/lib/network/getNextNodeId'
import saveNetworkToStorage from '@/lib/network/saveToStorage'

const GRID_SPACING_X = 80
const GRID_SPACING_Y = 50

export interface NetworkStore {
	network: Network
	loadNetworkFromStorage: () => void
	loadNetworkFromFile: () => Promise<void>
	saveNetworkToFile: () => Promise<void>
	addNode: (position: Position) => void
	setNodeName: (id: number, name: string) => void
	setNodePosition: (id: number, position: Position) => void
	snapNodeToGrid: (id: number) => void
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
		addNode: ({ x, y }: Position) => {
			set(state => {
				state.network.nodes.push({
					id: getNextNodeId(state.network.nodes),
					name: 'Node',
					x: Math.round(x / GRID_SPACING_X) * GRID_SPACING_X,
					y: Math.round(y / GRID_SPACING_Y) * GRID_SPACING_Y
				})
			})

			saveNetworkToStorage(get().network)
		},
		setNodeName: (id, name) => {
			set(state => {
				const node = state.network.nodes.find(node => node.id === id)
				if (!node) return

				node.name = name
			})

			saveNetworkToStorage(get().network)
		},
		setNodePosition: (id, position) => {
			set(state => {
				const node = state.network.nodes.find(node => node.id === id)
				if (!node) return

				node.x = position.x
				node.y = position.y
			})

			saveNetworkToStorage(get().network)
		},
		snapNodeToGrid: id => {
			set(state => {
				const node = state.network.nodes.find(node => node.id === id)
				if (!node) return

				node.x = Math.round(node.x / GRID_SPACING_X) * GRID_SPACING_X
				node.y = Math.round(node.y / GRID_SPACING_Y) * GRID_SPACING_Y
			})

			saveNetworkToStorage(get().network)
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

			saveNetworkToStorage(get().network)
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

			saveNetworkToStorage(get().network)
		},
		removeEdge: ({ from, to }) => {
			set(state => {
				const index = state.network.edges.findIndex(
					edge => edge.from === from && edge.to === to
				)
				if (index < 0) return

				state.network.edges.splice(index, 1)
			})

			saveNetworkToStorage(get().network)
		}
	}))
)

export default useNetworkStore
