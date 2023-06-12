import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { ReactNode } from 'react'

export interface SheetStore {
	isOpen: boolean
	close: () => void

	content: ReactNode | null
	setContent: (content: ReactNode) => void

	isFullScreen: boolean
	toggleFullScreen: () => void
}

const useSheetStore = create(
	immer<SheetStore>(set => ({
		isOpen: false,
		close: () => {
			set(state => {
				state.isOpen = false
			})
		},

		content: null,
		setContent: content => {
			set(state => {
				state.isOpen = true
				state.content = content
			})
		},

		isFullScreen: false,
		toggleFullScreen: () => {
			set(state => {
				state.isFullScreen = !state.isFullScreen
			})
		}
	}))
)

export default useSheetStore
