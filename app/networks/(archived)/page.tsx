import { Suspense } from 'react'

import ArchivedNetworkList from './ArchivedNetworkList'
import pageMetadata from '@/lib/metadata/page'

export const generateMetadata = () =>
	pageMetadata({
		title: 'Archived Networks | SamIam',
		description: 'View archived networks at SamIam',
		previewTitle: 'Archived Networks'
	})

const ArchivedNetworks = () => (
	<div className="flex flex-col items-stretch gap-2 px-8 py-6">
		<h1>Archived Networks</h1>
		<Suspense fallback={<p>Loading...</p>}>
			<ArchivedNetworkList />
		</Suspense>
	</div>
)

export default ArchivedNetworks
