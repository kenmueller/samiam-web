import BeliefNetwork from 'samiam/lib/belief-network'
import BeliefNetworkNode from 'samiam/lib/node'

export default class BeliefNetworkWithNodeMap extends BeliefNetwork {
	nodeMap = new Map<number, BeliefNetworkNode>()
}
