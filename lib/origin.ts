if (!process.env.NEXT_PUBLIC_HOST) throw new Error('Missing NEXT_PUBLIC_HOST')

import DEV from './dev'

const ORIGIN = new URL(
	`${DEV ? 'http' : 'https'}://${process.env.NEXT_PUBLIC_HOST}`
)

export default ORIGIN
