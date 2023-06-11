import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { Position } from '@/lib/network'

export interface CanvasStore {
	center: Position
	setCenter: (center: Position) => void

	/** Node ID */
	currentArrowFrom: number | null
	setCurrentArrowFrom: (id: number | null) => void
}

const useCanvasStore = create(
	immer<CanvasStore>(set => ({
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
		}
	}))
)

export default useCanvasStore
