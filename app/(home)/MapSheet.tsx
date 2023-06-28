'use client'

import { useMemo, useState } from 'react'
import Evidence from 'samiam/lib/evidence'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import MapSheetNode from './MapSheetNode'
import renderTextWithMath from '@/lib/renderTextWithMath'

const MapSheet = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)

	const [selectedNodes, setSelectedNodes] = useState<number[]>([])

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

	const nodes = useMemo(
		() => selectedNodes.map(id => beliefNetwork.nodeMap.get(id)!),
		[beliefNetwork, selectedNodes]
	)

	const map = useMemo(
		() => beliefNetwork.map(evidence, nodes),
		[beliefNetwork, evidence, nodes]
	)

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h3>MAP</h3>
			<div>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{MAP}, \\text{evidence}_{\\text{obs}}|\\text{evidence}_{\\text{int}}) = ${map.jointProbability}$`
						)
					}}
				/>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{MAP}|\\text{evidence}_{\\text{obs}}, \\text{evidence}_{\\text{int}}) = ${map.condProbability}$`
						)
					}}
				/>
			</div>
			<div>
				<button
					className="text-sky-500"
					onClick={() => {
						setSelectedNodes(
							Object.values(network.nodes)
								.filter(
									node =>
										!(
											node.assertionType !== undefined &&
											node.assertedValue !== undefined
										)
								)
								.map(node => node.id)
						)
					}}
				>
					Select All
				</button>
				<div>
					{Object.values(network.nodes).map(node => (
						<MapSheetNode
							key={node.id}
							node={node}
							instantiations={map.instantiations}
							selected={selectedNodes.includes(node.id)}
							setSelected={selected => {
								setSelectedNodes(selectedNodes =>
									selected
										? [...selectedNodes, node.id]
										: selectedNodes.filter(
												selectedNode => selectedNode !== node.id
										  )
								)
							}}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default MapSheet
