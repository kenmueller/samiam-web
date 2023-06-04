import { MetadataRoute } from 'next'

import ORIGIN from '@/lib/origin'

export const dynamic = 'force-dynamic'

const deployDate = new Date()

const sitemap = (): MetadataRoute.Sitemap => [
	{
		url: ORIGIN.href,
		lastModified: deployDate
	}
]

export default sitemap
