import { User } from 'next-auth/core/types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface UserStore {
	user: User | null
	setUser: (user: User | null) => void
}

const useUserStore = create(
	immer<UserStore>(set => ({
		user: null,
		setUser: user => {
			set(state => {
				state.user = user
			})
		}
	}))
)

export default useUserStore
