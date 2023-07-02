'use client'

import { useMemo } from 'react'
import { useDeepCompareMemo } from 'use-deep-compare'

import { Node } from '@/lib/network'
import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import getEvidence, { networkToEvidenceNodes } from '@/lib/network/getEvidence'

const NodeMonitor = ({ node }: { node: Node }) => {
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

	const distribution = useMemo(
		() =>
			beliefNetwork.posteriorMarginal(
				evidence,
				beliefNetwork.nodeMap.get(node.id)!
			),
		[evidence, beliefNetwork, node.id]
	)

	return (
		<table className="flex flex-col items-stretch gap-2 border-separate border-spacing-2">
			<tbody>
				{node.values.map((value, valueIndex) => {
					const probability = distribution[valueIndex]

					return (
						<tr key={valueIndex}>
							<td className="w-8 bg-white border border-black">
								<div
									className="h-[24px] bg-green-500"
									style={{ width: `${probability * 100}%` }}
								/>
							</td>
							<td className="text-right">{(probability * 100).toFixed(2)}%</td>
							<td>{value}</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

export default NodeMonitor
