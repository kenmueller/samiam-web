import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { castDraft } from 'immer'

import { Bounds, Position } from '@/lib/network'
import useNetworkStore from './network'
import isInBounds from '../isInBounds'

export interface CanvasStore {
	center: Position
	setCenter: (center: Position) => void

	/** Node ID */
	currentArrowFrom: number | null
	setCurrentArrowFrom: (id: number | null) => void

	nodeRefs: Record<string, HTMLElement>
	getNodeRef: (id: number) => HTMLElement | null
	setNodeRef: (id: number, node: HTMLElement | null) => void

	selectedNodes: number[]
	selectNodesInBounds: (bounds: Bounds) => void
	unselectNodes: () => void
}

const useCanvasStore = create(
	immer<CanvasStore>((set, get) => ({
		center: { x: 0, y: 0 },
		setCenter: center => {
			set(state => {
				state.center = center
			})
		},

		currentArrowFrom: null,
		setCurrentArrowFrom: id => {
			set(state => {
				state.currentArrowFrom = id
			})
		},

		nodeRefs: {},
		getNodeRef: id => get().nodeRefs[id] ?? null,
		setNodeRef: (id, node) => {
			set(state => {
				if (node) {
					state.nodeRefs[id] = castDraft(node)
				} else {
					delete state.nodeRefs[id]
				}
			})
		},

		selectedNodes: [],
		selectNodesInBounds: bounds => {
			const nodes = Object.values(useNetworkStore.getState().network.nodes)
			console.log(bounds)
			set(state => {
				state.selectedNodes = nodes
					.filter(
						node => (
							console.log(isInBounds(node, bounds)), isInBounds(node, bounds)
						)
					)
					.map(node => node.id)
			})
		},
		unselectNodes: () => {
			set(state => {
				state.selectedNodes = []
			})
		}
	}))
)

export default useCanvasStore
