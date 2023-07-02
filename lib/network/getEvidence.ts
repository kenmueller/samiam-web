import Evidence from 'samiam/lib/evidence'
import pick from 'lodash/pick'

import Network from '.'
import BeliefNetworkWithNodeMap from '@/lib/beliefNetwork/withNodeMap'

export const networkToEvidenceNodes = (network: Network) =>
	Object.values(network.nodes).map(node =>
		pick(
			node,
			'id',
			'parents',
			'children',
			'values',
			'assertionType',
			'assertedValue',
			'cpt'
		)
	)

export type EvidenceNode = ReturnType<typeof networkToEvidenceNodes>[number]

const getEvidence = (
	evidenceNodes: EvidenceNode[],
	beliefNetwork: BeliefNetworkWithNodeMap
) =>
	evidenceNodes.reduce<Evidence>(
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
