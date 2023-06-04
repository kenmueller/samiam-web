import { MetadataRoute } from 'next'

import maskableImage from '@/assets/maskable.png'

export const dynamic = 'force-dynamic'

const manifest = (): MetadataRoute.Manifest => ({
	dir: 'ltr',
	lang: 'en-US',
	scope: '/',
	start_url: '/',
	name: 'SamIam',
	short_name: 'SamIam',
	description: 'SamIam',
	display: 'standalone',
	theme_color: 'white',
	background_color: 'white',
	categories: ['education', 'utilities', 'productivity'],
	icons: [
		{
			src: maskableImage.src,
			sizes: '512x512',
			purpose: 'maskable'
		},
		{
			src: maskableImage.src,
			sizes: '512x512',
			purpose: 'any'
		}
	]
})

export default manifest
