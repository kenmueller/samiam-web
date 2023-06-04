import { getCSP, SELF, UNSAFE_INLINE, UNSAFE_EVAL } from 'csp-header'
import withPlugins from 'next-compose-plugins'
import withPwa from '@ducanh2912/next-pwa'
import withBundleAnalyzer from '@next/bundle-analyzer'

const DEV = process.env.NODE_ENV === 'development'

const csp = getCSP({
	directives: {
		'base-uri': [SELF],
		'default-src': [SELF],
		'style-src': [SELF, UNSAFE_INLINE],
		'script-src': [SELF, UNSAFE_INLINE, ...(DEV ? [UNSAFE_EVAL] : [])]
	}
})

/** @type {import('next').NextConfig} */
const config = {
	swcMinify: true,
	experimental: {
		serverActions: true
	},
	images: {
		domains: []
	},
	headers: async () => [
		{
			source: '/:path*',
			headers: [{ key: 'content-security-policy', value: csp }]
		}
	]
}

export default withPlugins(
	[
		withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }),
		withPwa({ disable: DEV, dest: 'public' })
	],
	config
)
