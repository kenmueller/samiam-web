import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import Network, { Position } from '@/lib/network'
import getNextNodeId from '@/lib/network/getNextNodeId'
import saveNetworkToStorage from '@/lib/network/saveToStorage'

const GRID_SPACING_X = 80
const GRID_SPACING_Y = 50

export interface Edge {
	from: number
	to: number
}

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
		network: { nodes: [] },
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
			const position: Position = {
				x: Math.round(x / GRID_SPACING_X) * GRID_SPACING_X,
				y: Math.round(y / GRID_SPACING_Y) * GRID_SPACING_Y
			}

			if (
				get().network.nodes.some(
					node => node.x === position.x && node.y === position.y
				)
			) {
				// Node already exists at this position
				return
			}

			set(state => {
				const id = getNextNodeId(state.network.nodes)

				state.network.nodes.push({
					id,
					name: `Node ${id}`,
					parents: [],
					values: ['yes', 'no'],
					cpt: [[0.5, 0.5]],
					...position
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

				const node = state.network.nodes[index]

				state.network.nodes = state.network.nodes.filter(
					otherNode =>
						!(node.id === otherNode.id || node.parents.includes(otherNode.id))
				)
			})

			saveNetworkToStorage(get().network)
		},
		addEdge: edge => {
			set(state => {
				if (edge.from === edge.to)
					throw new Error('Cannot connect node to itself')

				const fromNode = state.network.nodes.find(node => node.id === edge.from)
				if (!fromNode) return

				const toNode = state.network.nodes.find(node => node.id === edge.to)
				if (!toNode) return

				if (toNode.parents.includes(fromNode.id))
					throw new Error('Edge already exists')

				toNode.parents.push(fromNode.id)
			})

			saveNetworkToStorage(get().network)
		},
		removeEdge: edge => {
			set(state => {
				const toNode = state.network.nodes.find(node => node.id === edge.to)
				if (!toNode) return

				const fromNodeIndex = toNode.parents.findIndex(id => id === edge.from)
				if (fromNodeIndex < 0) return

				toNode.parents.splice(fromNodeIndex, 1)
			})

			saveNetworkToStorage(get().network)
		}
	}))
)

export default useNetworkStore
