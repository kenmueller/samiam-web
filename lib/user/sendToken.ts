import { User as AuthUser } from 'firebase/auth'

import errorFromResponse from '@/lib/error/fromResponse'
import UserTokenData from './tokenData'

/** `null` to revoke token. */
const sendToken = async (authUser: AuthUser | null) => {
	const token = authUser && (await authUser.getIdToken())

	const user: UserTokenData | null = authUser && {
		id: authUser.uid,
		photo: authUser.photoURL,
		name: authUser.displayName!,
		email: authUser.email!
	}

	const response = await fetch('/api/token', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(token && user && { token, user })
	})

	if (!response.ok) throw await errorFromResponse(response)
}

export default sendToken
