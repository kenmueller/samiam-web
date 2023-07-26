'use client'

import useImmediateEffect from '@/lib/useImmediateEffect'
import pick from '@/lib/pick'
import Network, { NetworkMeta } from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'

const SetNetworkPageState = ({
	meta,
	network
}: {
	meta: NetworkMeta
	network: Network
}) => {
	const { setNetwork } = useNetworkStore(pick('setNetwork'))

	useImmediateEffect(() => {
		setNetwork(meta, network)
	}, [meta, network, setNetwork])

	return null
}

export default SetNetworkPageState
