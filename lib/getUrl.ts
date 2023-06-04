import { headers } from 'next/headers'

import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

const getUrl = () => {
	const url = headers().get('x-url')
	if (!url) throw new HttpError(ErrorCode.Internal, 'Missing x-url header')

	return new URL(url)
}

export default getUrl
