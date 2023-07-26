import { getServerSession } from 'next-auth'

import authOptions from '../auth'
import User from '.'

const getCurrentUser = async () =>
	((await getServerSession(authOptions))?.user as User | undefined) ?? null

export default getCurrentUser
