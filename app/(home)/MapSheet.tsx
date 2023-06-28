'use client'

import { useMemo, useState } from 'react'
import Observation from 'samiam/lib/observation'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import MapSheetNode from './MapSheetNode'

const MapSheet = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)

	const [selectedNodes, setSelectedNodes] = useState<number[]>([])

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

	const map = useMemo(
		() => beliefNetwork.map(evidence),
		[beliefNetwork, evidence]
	)

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h3>MAP</h3>
			<p>{map}</p>
			<div>
				<button
					className="text-sky-500"
					onClick={() => {
						setSelectedNodes(Object.values(network.nodes).map(node => node.id))
					}}
				>
					Select All
				</button>
				<div>
					{Object.values(network.nodes).map(node => (
						<MapSheetNode
							key={node.id}
							node={node}
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
