import BeliefNetwork from 'samiam/lib/belief-network'
import BeliefNetworkNode, { Id as BeliefNetworkNodeId } from 'samiam/lib/node'

export default class BeliefNetworkWithNodeMap<
	BeliefNetworkNodeLike extends BeliefNetworkNode = BeliefNetworkNode
> extends BeliefNetwork<BeliefNetworkNodeLike> {
	nodeMap = new Map<BeliefNetworkNodeId, BeliefNetworkNodeLike>()

	mpe = (...args: unknown[]) => Math.random()
	map = (...args: unknown[]) => Math.random()
}
