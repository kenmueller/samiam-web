import { Suspense } from 'react'

import pageMetadata from '@/lib/metadata/page'

export const generateMetadata = () =>
	pageMetadata({
		title: 'About | SamIam',
		description: 'About SamIam',
		previewTitle: 'About'
	})

const ArchivedNetworks = () => (
	<div className="flex flex-col items-stretch gap-2 px-8 py-6">
		<h1>About SamIam</h1>
		<p>
			Contact{' '}
			<a
				className="text-sky-500 underline"
				href="https://github.com/kenmueller"
			>
				Ken Mueller
			</a>{' '}
			for more information
		</p>
	</div>
)

export default ArchivedNetworks
