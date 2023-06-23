import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const OPTIONS = [
	'select',
	'move',
	'add-node',
	'add-edge',
	'remove'
] as const

export type Option = (typeof OPTIONS)[number]

export interface OptionStore {
	option: Option
	setOption: (option: Option) => void
}

const useOptionStore = create(
	immer<OptionStore>(set => ({
		option: 'select',
		setOption: option => {
			set(state => {
				state.option = option
			})
		}
	}))
)

export default useOptionStore
