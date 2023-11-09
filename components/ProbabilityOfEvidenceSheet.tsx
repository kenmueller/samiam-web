'use client'

import { useCallback, useEffect } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import renderTextWithMath from '@/lib/renderTextWithMath'
import { setEliminationOrderHeuristic } from '@/lib/network/actions'
import { EliminationOrderHeuristic } from '@/lib/network'
import useProbabilityOfEvidence from '@/lib/useProbabilityOfEvidence'
import useSheetStore from '@/lib/stores/sheet'

const ProbabilityOfEvidenceSheet = () => {
	const { network, applyAction } = useNetworkStore(
		pick('network', 'applyAction')
	)
	const { close } = useSheetStore()

	const nodeCount = Object.keys(network.nodes).length

	useEffect(() => {
		if (!nodeCount) close()
	}, [nodeCount, close])

	const { evidenceString, probabilityOfEvidence } = useProbabilityOfEvidence()

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
