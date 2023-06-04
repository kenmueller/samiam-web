import { MetadataRoute } from 'next'

import ORIGIN from '@/lib/origin'

export const dynamic = 'force-dynamic'

const robots = (): MetadataRoute.Robots => ({
	rules: { userAgent: '*', allow: '/' },
	sitemap: new URL('/sitemap.xml', ORIGIN).href
})

export default robots
