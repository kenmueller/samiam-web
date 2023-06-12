import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { castDraft } from 'immer'

import { Position } from '@/lib/network'

export interface CanvasStore {
	center: Position
	setCenter: (center: Position) => void

	/** Node ID */
	currentArrowFrom: number | null
	setCurrentArrowFrom: (id: number | null) => void

	nodeRefs: Record<string, HTMLElement>
	getNodeRef: (id: number) => HTMLElement | null
	setNodeRef: (id: number, node: HTMLElement | null) => void
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
		}
	}))
)

export default useCanvasStore
