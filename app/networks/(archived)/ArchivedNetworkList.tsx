import Link from 'next/link'

import getArchivedNetworks from '@/lib/network/getArchived'

const ArchivedNetworkList = async () => {
	const archivedNetworks = await getArchivedNetworks()

	return (
		<div className="flex flex-col items-stretch gap-2">
			{archivedNetworks ? (
				archivedNetworks.length > 0 ? (
					archivedNetworks.map(network => (
						<Link
							key={network.id}
							href={`/networks/${encodeURIComponent(network.id)}`}
						>
							{network.name ?? 'Untitled Network'}
						</Link>
					))
				) : (
					<p>No archived networks</p>
				)
			) : (
				<p>Loading...</p>
			)}
		</div>
	)
}

export default ArchivedNetworkList
