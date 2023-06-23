import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { castDraft } from 'immer'

import { Bounds, Node, Position } from '@/lib/network'
import useNetworkStore from './network'
import isInBounds from '../isInBounds'
import { copyNode } from '../network/actions'

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
	copySelectedNodes: () => Promise<void> | false
	pasteCopiedNodes: (copiedText: string) => boolean
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

			set(state => {
				state.selectedNodes = nodes
					.filter(node => isInBounds(node, bounds))
					.map(node => node.id)
			})
		},
		unselectNodes: () => {
			set(state => {
				state.selectedNodes = []
			})
		},
		copySelectedNodes: () => {
			const { selectedNodes } = get()
			if (!selectedNodes.length) return false

			const { network } = useNetworkStore.getState()

			const copiedNodes = selectedNodes.map(id => network.nodes[id.toString()])

			return navigator.clipboard.writeText(
				`samiam:${JSON.stringify(copiedNodes)}`
			)
		},
		pasteCopiedNodes: (copiedText: string) => {
			const copiedValue = copiedText.match(/^samiam:(.*)$/)?.[1]
			if (!copiedValue) return false

			const copiedNodes: Node[] = JSON.parse(copiedValue)
			const { applyAction } = useNetworkStore.getState()

			for (const node of copiedNodes) applyAction(copyNode(node))

			return true
		}
	}))
)

export default useCanvasStore
