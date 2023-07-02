'use client'

import { useMemo } from 'react'
import { useDeepCompareMemo } from 'use-deep-compare'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import getEvidence, { networkToEvidenceNodes } from '@/lib/network/getEvidence'
import renderTextWithMath from '@/lib/renderTextWithMath'

const ProbabilityOfEvidenceSheet = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)

	const evidenceNodes = useMemo(
		() => networkToEvidenceNodes(network),
		[network]
	)

	const evidence = useDeepCompareMemo(
		() => getEvidence(evidenceNodes, beliefNetwork),
		[evidenceNodes]
	)

	const probabilityOfEvidence = useMemo(
		() => beliefNetwork.probability(evidence),
		[beliefNetwork, evidence]
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

		return [observations, interventions && `$do($${interventions}$)$`]
			.filter(Boolean)
			.join(' | ')
	}, [evidence])

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h3>Probability of Evidence</h3>
			<div>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P($${evidenceString}$) = ${probabilityOfEvidence}$`
						)
					}}
				/>
			</div>
			<div></div>
		</div>
	)
}

export default ProbabilityOfEvidenceSheet
