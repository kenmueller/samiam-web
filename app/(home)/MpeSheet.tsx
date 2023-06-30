'use client'

import { useMemo } from 'react'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import renderTextWithMath from '@/lib/renderTextWithMath'
import getEvidence from '@/lib/network/getEvidence'

const MpeSheet = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)

	const evidence = useMemo(
		() => getEvidence(network, beliefNetwork),
		[network, beliefNetwork]
	)

	const mpe = useMemo(
		() => beliefNetwork.mpe(evidence),
		[beliefNetwork, evidence]
	)

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h3>MPE</h3>
			<div>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{MPE}, \\text{e}_{\\text{obs}}|\\text{e}_{\\text{int}}) = ${mpe.jointProbability}$`
						)
					}}
				/>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{MPE}|\\text{e}_{\\text{obs}}, \\text{e}_{\\text{int}}) = ${mpe.condProbability}$`
						)
					}}
				/>
			</div>
		</div>
	)
}

export default MpeSheet
