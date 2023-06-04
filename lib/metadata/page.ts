import { Metadata } from 'next'

import getUrl from '@/lib/getUrl'

export interface PageMetadataBaseOptions {
	title: string
	description: string
}

export type PageMetadataOptions = PageMetadataBaseOptions &
	(
		| { previewTitle: string }
		| { previewImage: { src: string; quality?: number } }
	)

const pageMetadata = (options: PageMetadataOptions): Metadata => {
	const fullUrl = getUrl()
	const url = new URL(fullUrl.pathname, fullUrl.origin).href

	const image =
		'previewTitle' in options
			? `/api/preview?title=${encodeURIComponent(options.previewTitle)}`
			: `/_next/image?url=${encodeURIComponent(
					options.previewImage.src
			  )}&w=1200&q=${options.previewImage.quality ?? 75}`

	return {
		alternates: { canonical: url },
		title: options.title,
		description: options.description,
		openGraph: {
			type: 'website',
			title: options.title,
			description: options.description,
			siteName: 'SamIam',
			locale: 'en_US',
			url,
			images: image,
			countryName: 'United States'
		},
		twitter: {
			card: 'summary_large_image',
			site: '@samiam',
			creator: '@samiam',
			title: options.title,
			description: options.description,
			images: image
		}
	}
}

export default pageMetadata
