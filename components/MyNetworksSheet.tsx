'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import pick from '@/lib/pick'
import useSheetStore from '@/lib/stores/sheet'
import useUserStore from '@/lib/stores/user'

const MyNetworksSheet = () => {
	const { close } = useSheetStore(pick('close'))
	const { user, networks, getNetworks } = useUserStore(
		pick('user', 'networks', 'getNetworks')
	)

	useEffect(() => {
		getNetworks()
	}, [getNetworks])

	useEffect(() => {
		if (!user) close()
	}, [user, close])

	if (!user) return null

	return (
		<div className="flex flex-col items-stretch gap-2">
			{networks ? (
				networks.length > 0 ? (
					networks.map(network => (
						<Link
							key={network.id}
							href={`/networks/${encodeURIComponent(network.id)}`}
						>
							{network.name}
						</Link>
					))
				) : (
					<p>No networks</p>
				)
			) : (
				<p>Loading...</p>
			)}
		</div>
	)
}

export default MyNetworksSheet
