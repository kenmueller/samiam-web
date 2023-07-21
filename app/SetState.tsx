'use client'

import User from '@/lib/user'
import useImmediateEffect from '@/lib/useImmediateEffect'
import useUserStore from '@/lib/stores/user'
import pick from '@/lib/pick'

const SetRootLayoutState = ({ user }: { user: User | null }) => {
	const { setUser } = useUserStore(pick('setUser'))

	useImmediateEffect(() => {
		setUser(user)
	}, [user, setUser])

	return null
}

export default SetRootLayoutState
