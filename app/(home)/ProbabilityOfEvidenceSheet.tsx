'use client'

import { useMemo } from 'react'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import getEvidence from '@/lib/network/getEvidence'
import renderTextWithMath from '@/lib/renderTextWithMath'

const ProbabilityOfEvidenceSheet = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)

	const evidence = useMemo(
		() => getEvidence(network, beliefNetwork),
		[network, beliefNetwork]
	)

	const probabilityOfEvidence = useMemo(
		() => beliefNetwork.probability(evidence),
		[beliefNetwork, evidence]
	)

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h3>Probability of Evidence</h3>
			<div>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{e}) = ${probabilityOfEvidence}$`
						)
					}}
				/>
			</div>
			<div></div>
		</div>
	)
}

export default ProbabilityOfEvidenceSheet
