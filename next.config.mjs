import withPlugins from 'next-compose-plugins'
import withPwa from '@ducanh2912/next-pwa'
import withBundleAnalyzer from '@next/bundle-analyzer'

const DEV = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const config = {
	swcMinify: true,
	images: {
		domains: []
	}
}

export default withPlugins(
	[
		withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }),
		withPwa({ disable: DEV, dest: 'public' })
	],
	config
)
