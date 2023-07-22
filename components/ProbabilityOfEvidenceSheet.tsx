'use client'

import { useCallback, useMemo } from 'react'
import { useDeepCompareMemo } from 'use-deep-compare'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import getEvidence, { networkToEvidenceNodes } from '@/lib/network/getEvidence'
import renderTextWithMath from '@/lib/renderTextWithMath'
import { setEliminationOrderHeuristic } from '@/lib/network/actions'
import { EliminationOrderHeuristic } from '@/lib/network'

const ProbabilityOfEvidenceSheet = () => {
	const { network, beliefNetwork, applyAction } = useNetworkStore(
		pick('network', 'beliefNetwork', 'applyAction')
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

		return (
			[observations, interventions && `$do($${interventions}$)$`]
				.filter(Boolean)
				.join(' | ') || '$\\emptyset$'
		)
	}, [evidence])

	const onValueChange = useCallback(
		(value: string) => {
			applyAction(
				setEliminationOrderHeuristic(value as EliminationOrderHeuristic)
			)
		},
		[applyAction]
	)

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h3>Probability of Evidence</h3>
			<p
				dangerouslySetInnerHTML={{
					__html: renderTextWithMath(
						`$P($${evidenceString}$) = ${probabilityOfEvidence}$`
					)
				}}
			/>
			<div className="flex flex-col items-stretch gap-1">
				<h4>Elimination Order Heuristic</h4>
				<Select
					value={network.eliminationOrderHeuristic}
					onValueChange={onValueChange}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Elimination Order Heuristic" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="min-fill" className="cursor-pointer">
							Min Fill
						</SelectItem>
						<SelectItem value="min-size" className="cursor-pointer">
							Min Size
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}

export default ProbabilityOfEvidenceSheet
