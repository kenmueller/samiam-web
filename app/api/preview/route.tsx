import { NextRequest, NextResponse, ImageResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import Preview from './Preview'
import getUrl from '@/lib/getUrl'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

export const GET = async (_request: NextRequest) => {
	try {
		const url = getUrl()

		const title = url.searchParams.get('title')
		if (!title) throw new HttpError(ErrorCode.BadRequest, 'Missing title')

		return new ImageResponse(<Preview title={title} />)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
