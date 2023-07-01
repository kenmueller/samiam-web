'use client'

import { useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import Instantiation from 'samiam/lib/instantiation'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import MapSheetNode from './MapSheetNode'
import renderTextWithMath from '@/lib/renderTextWithMath'
import getEvidence from '@/lib/network/getEvidence'
import IndeterminateCheckbox, {
	IndeterminateCheckboxValue
} from '@/components/IndeterminateCheckbox'
import { AssertionType, Node } from '@/lib/network'

import styles from './MapSheet.module.scss'

export interface MapNode {
	node: Node
	hasEvidence: boolean
	instantiation: Instantiation | null
	type: AssertionType | 'map' | 'unselected'
}

const MapSheet = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)

	const [selectedNodes, setSelectedNodes] = useState<number[]>([])

	const allNonEvidenceNodes = useMemo(
		() =>
			Object.values(network.nodes).filter(
				node =>
					!(
						node.assertionType !== undefined && node.assertedValue !== undefined
					)
			),
		[network]
	)

	const selectAllState: IndeterminateCheckboxValue = useMemo(
		() =>
			allNonEvidenceNodes.every(node => selectedNodes.includes(node.id))
				? 'checked'
				: allNonEvidenceNodes.some(node => selectedNodes.includes(node.id))
				? 'indeterminate'
				: 'unchecked',
		[allNonEvidenceNodes, selectedNodes]
	)

	const evidence = useMemo(
		() => getEvidence(network, beliefNetwork),
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

	const mapNodes: MapNode[] = useMemo(
		() =>
			Object.values(network.nodes).map(node => {
				const hasEvidence =
					node.assertionType !== undefined && node.assertedValue !== undefined

				const instantiation = hasEvidence
					? null
					: map.instantiations.find(
							instantiation => instantiation.node.id === node.id
					  ) ?? null

				const type: MapNode['type'] = hasEvidence
					? node.assertionType!
					: instantiation
					? 'map'
					: 'unselected'

				return { node, hasEvidence, instantiation, type }
			}),
		[map.instantiations, network.nodes]
	)

	const observationMapNodes = useMemo(
		() => mapNodes.filter(mapNode => mapNode.type === 'observation'),
		[mapNodes]
	)

	const interventionMapNodes = useMemo(
		() => mapNodes.filter(mapNode => mapNode.type === 'intervention'),
		[mapNodes]
	)

	const mapMapNodes = useMemo(
		() => mapNodes.filter(mapNode => mapNode.type === 'map'),
		[mapNodes]
	)

	const unselectedMapNodes = useMemo(
		() => mapNodes.filter(mapNode => mapNode.type === 'unselected'),
		[mapNodes]
	)

	const selectAll = useCallback(() => {
		switch (selectAllState) {
			case 'checked':
			case 'indeterminate':
				setSelectedNodes([])
				break
			case 'unchecked':
				setSelectedNodes(allNonEvidenceNodes.map(node => node.id))
				break
		}
	}, [selectAllState, allNonEvidenceNodes])

	const renderMapNodes = (mapNodes: MapNode[]) =>
		mapNodes.map(mapNode => (
			<MapSheetNode
				key={mapNode.node.id}
				mapNode={mapNode}
				selected={selectedNodes.includes(mapNode.node.id)}
				setSelected={selected => {
					setSelectedNodes(selectedNodes =>
						selected
							? [...selectedNodes, mapNode.node.id]
							: selectedNodes.filter(
									selectedNode => selectedNode !== mapNode.node.id
							  )
					)
				}}
			/>
		))

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h3>MAP</h3>
			<div>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{MAP}, \\text{e}_{\\text{obs}}|\\text{e}_{\\text{int}}) = ${map.jointProbability}$`
						)
					}}
				/>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{MAP}|\\text{e}_{\\text{obs}}, \\text{e}_{\\text{int}}) = ${map.condProbability}$`
						)
					}}
				/>
			</div>
			<div className="overflow-x-auto" style={{ transform: 'rotateX(180deg)' }}>
				<table
					className={cx(styles.table, 'table-fixed border-collapse')}
					style={{ transform: 'rotateX(180deg)' }}
					cellPadding={0}
				>
					<thead>
						<tr>
							<th>
								<div className="flex justify-center items-center h-full">
									<IndeterminateCheckbox
										value={selectAllState}
										onChange={selectAll}
									/>
								</div>
							</th>
							<th className="max-w-[115px]">Node</th>
							<th className="max-w-[115px]">Value</th>
						</tr>
					</thead>
					<tbody>
						{mapMapNodes.length > 0 && renderMapNodes(mapMapNodes)}
						{unselectedMapNodes.length > 0 && (
							<>
								<tr>
									<td className="text-center underline" colSpan={3}>
										Unselected
									</td>
								</tr>
								{renderMapNodes(unselectedMapNodes)}
							</>
						)}
						{observationMapNodes.length > 0 && (
							<>
								<tr>
									<td className="text-center underline" colSpan={3}>
										Observed
									</td>
								</tr>
								{renderMapNodes(observationMapNodes)}
							</>
						)}
						{interventionMapNodes.length > 0 && (
							<>
								<tr>
									<td className="text-center underline" colSpan={3}>
										Intervened
									</td>
								</tr>
								{renderMapNodes(interventionMapNodes)}
							</>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default MapSheet
