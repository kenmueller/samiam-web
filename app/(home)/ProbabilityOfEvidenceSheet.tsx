'use client'

import { useMemo } from 'react'
import Observation from 'samiam/lib/observation'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'

const ProbabilityOfEvidenceSheet = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)

	const evidence = useMemo(
		() =>
			Object.values(network.nodes).reduce<Observation[]>(
				(observations, node) => {
					if (
						node.assertionType === 'observation' &&
						node.assertedValue !== undefined
					)
						observations.push({
							node: beliefNetwork.nodeMap.get(node.id)!,
							value: node.assertedValue
						})

					return observations
				},
				[]
			),
		[network, beliefNetwork]
	)

	const probabilityOfEvidence = useMemo(
		() => beliefNetwork.probability(evidence),
		[beliefNetwork, evidence]
	)

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h3>Probability of Evidence</h3>
			<p>{probabilityOfEvidence}</p>
		</div>
	)
}

export default ProbabilityOfEvidenceSheet
