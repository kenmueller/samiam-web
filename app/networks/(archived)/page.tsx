import { Suspense } from 'react'

import ArchivedNetworkList from './ArchivedNetworkList'

export const dynamic = 'force-static'

const ArchivedNetworks = () => (
	<div className="flex flex-col items-stretch gap-2 px-8 py-6">
		<h1>Archived Networks</h1>
		<Suspense fallback={<p>Loading...</p>}>
			<ArchivedNetworkList />
		</Suspense>
	</div>
)

export default ArchivedNetworks
