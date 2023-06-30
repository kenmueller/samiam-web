import Evidence from 'samiam/lib/evidence'

import Network from '.'
import BeliefNetworkWithNodeMap from '@/lib/beliefNetwork/withNodeMap'

const getEvidence = (
	network: Network,
	beliefNetwork: BeliefNetworkWithNodeMap
) =>
	Object.values(network.nodes).reduce<Evidence>(
		(evidence, node) => {
			if (
				node.assertionType === 'observation' &&
				node.assertedValue !== undefined
			)
				evidence.observations.push({
					node: beliefNetwork.nodeMap.get(node.id)!,
					value: node.assertedValue
				})

			if (
				node.assertionType === 'intervention' &&
				node.assertedValue !== undefined
			)
				evidence.interventions.push({
					node: beliefNetwork.nodeMap.get(node.id)!,
					value: node.assertedValue
				})

			return evidence
		},
		{
			observations: [],
			interventions: []
		}
	)

export default getEvidence
