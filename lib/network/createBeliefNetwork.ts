import BeliefNetwork from 'samiam/lib/belief-network'
import BeliefNetworkNode from 'samiam/lib/node'

import Network from '.'

const createBeliefNetwork = (network: Network) => {
	const beliefNetwork = new BeliefNetwork()
	const beliefNetworkNodes = new Map<number, BeliefNetworkNode>()

	for (const networkNode of network.nodes) {
		const beliefNetworkNode = new BeliefNetworkNode(networkNode.name, [])

		beliefNetworkNode.values = networkNode.values
		beliefNetworkNode.cpt = networkNode.cpt

		beliefNetworkNodes.set(networkNode.id, beliefNetworkNode)
		beliefNetwork.addNode(beliefNetworkNode)
	}

	for (const networkNode of network.nodes) {
		const beliefNetworkNode = beliefNetworkNodes.get(networkNode.id)

		if (!beliefNetworkNode)
			throw new Error(`Missing belief network node ${networkNode.id}`)

		for (const networkNodeParentId of networkNode.parents) {
			const parentBeliefNetworkNode =
				beliefNetworkNodes.get(networkNodeParentId)

			if (!parentBeliefNetworkNode)
				throw new Error(`Missing belief network node ${networkNodeParentId}`)

			beliefNetworkNode.addParent(parentBeliefNetworkNode)
		}
	}

	return beliefNetwork
}

export default createBeliefNetwork
