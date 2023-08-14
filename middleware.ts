import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'

import errorFromUnknown from './lib/error/fromUnknown'
import ORIGIN from './lib/origin'
import getCsp from './lib/csp'

const middleware = (request: NextRequest) => {
	try {
		const headers = new Headers(request.headers)

		const originalUrl = new URL(request.url)

		const search = originalUrl.searchParams.toString()
		const path = `${originalUrl.pathname}${search && `?${search}`}`

		headers.set('x-url', new URL(path, ORIGIN).href)

		const nonce = uuid()
		const csp = getCsp(nonce)

		const cspKey =
			request.nextUrl.pathname === '/csp-report-only'
				? 'content-security-policy-report-only'
				: 'content-security-policy'

		headers.set(cspKey, csp)
		headers.set('x-nonce', nonce)

		const response = NextResponse.next({
			request: { headers }
		})

		response.headers.set(cspKey, csp)

		return response
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}

export default middleware
