'use client'

import { useMemo } from 'react'
import Evidence from 'samiam/lib/evidence'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import renderTextWithMath from '@/lib/renderTextWithMath'

const MpeSheet = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)

	const evidence = useMemo(
		() =>
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
			),
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
							`$P(\\text{MPE}, \\text{evidence}_{\\text{obs}}|\\text{evidence}_{\\text{int}}) = ${mpe.jointProbability}$`
						)
					}}
				/>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{MPE}|\\text{evidence}_{\\text{obs}}, \\text{evidence}_{\\text{int}}) = ${mpe.condProbability}$`
						)
					}}
				/>
			</div>
		</div>
	)
}

export default MpeSheet
