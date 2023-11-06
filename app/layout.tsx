import { ReactNode } from 'react'
import { Viewport } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import cx from 'classnames'

import baseMetadata from '@/lib/metadata/base'
import ToastContainer from './ToastContainer'
import Sheet from '@/components/Sheet'
import FontAwesomeConfig from './FontAwesomeConfig'
import SetRootLayoutState from './SetState'
import getCurrentUser from '@/lib/user/getCurrent'

import 'balloon-css/balloon.css'
import 'react-toastify/dist/ReactToastify.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './layout.scss'

const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '700', '900'],
	fallback: [
		'system-ui',
		'-apple-system',
		'BlinkMacSystemFont',
		'Segoe UI',
		'Roboto',
		'Oxygen',
		'Ubuntu',
		'Cantarell',
		'Open Sans',
		'Helvetica Neue',
		'sans-serif'
	]
})

const sfMono = localFont({
	variable: '--font-sf-mono',
	src: '../assets/SFMono-Regular.otf',
	weight: '400',
	fallback: ['Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace']
})

export const dynamic = 'force-dynamic'
export const metadata = baseMetadata
export const viewport: Viewport = { themeColor: 'white' }

const RootLayout = async ({ children }: { children: ReactNode }) => {
	const user = await getCurrentUser()

	return (
		<html lang="en" dir="ltr" className="h-full scroll-smooth">
			<body
				className={cx(
					inter.className,
					sfMono.variable,
					'h-full scroll-smooth select-none touch-none'
				)}
			>
				<SetRootLayoutState user={user} />
				{children}
				<Sheet />
				<FontAwesomeConfig />
				<ToastContainer />
			</body>
		</html>
	)
}

export default RootLayout
