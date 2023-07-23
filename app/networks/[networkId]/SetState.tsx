'use client'

import useImmediateEffect from '@/lib/useImmediateEffect'
import pick from '@/lib/pick'
import Network from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'

const SetNetworkPageState = ({ network }: { network: Network }) => {
	const { setNetwork } = useNetworkStore(pick('setNetwork'))

	useImmediateEffect(() => {
		setNetwork(network)
	}, [network, setNetwork])

	return null
}

export default SetNetworkPageState
