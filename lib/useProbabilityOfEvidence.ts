import { useMemo } from 'react'
import { useDeepCompareMemo } from 'use-deep-compare'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import getEvidence, { networkToEvidenceNodes } from '@/lib/network/getEvidence'

const useProbabilityOfEvidence = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)

	const nodeCount = Object.keys(network.nodes).length

	const evidenceNodes = useMemo(
		() => networkToEvidenceNodes(network),
		[network]
	)

	const evidence = useDeepCompareMemo(
		() => getEvidence(evidenceNodes, beliefNetwork),
		[evidenceNodes]
	)

	const probabilityOfEvidence = useMemo(
		() => (nodeCount > 0 ? beliefNetwork.probability(evidence) : 1),
		[nodeCount, beliefNetwork, evidence]
	)

	const evidenceString = useMemo(() => {
		const observations = evidence.observations
			.map(
				observation =>
					`${observation.node.name} = ${
						observation.node.values[observation.value]
					}`
			)
			.join(', ')

		const interventions = evidence.interventions
			.map(
				intervention =>
					`${intervention.node.name} = ${
						intervention.node.values[intervention.value]
					}`
			)
			.join(', ')

		return (
			[observations, interventions && `$do($${interventions}$)$`]
				.filter(Boolean)
				.join(' | ') || '$\\emptyset$'
		)
	}, [evidence])

	return { evidenceString, probabilityOfEvidence }
}

export default useProbabilityOfEvidence
