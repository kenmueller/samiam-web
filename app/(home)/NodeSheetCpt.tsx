'use client'

import { useCallback, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { Node } from '@/lib/network'
import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import NodeSheetCptValue from './NodeSheetCptValue'
import useSheetStore from '@/lib/stores/sheet'
import NodeSheet from './NodeSheet'
import NodeSheetValue from './NodeSheetValue'

import styles from './NodeSheetCpt.module.scss'
import { addNodeValue, removeNodeValue } from '@/lib/network/actions'

const getRowSpan = (
	child: Node,
	parent: Node,
	getNode: (id: number) => Node
) => {
	let rowSpan = 1

	for (const otherParentId of child.parents) {
		if (otherParentId === parent.id) break
		rowSpan *= getNode(otherParentId).values.length
	}

	return rowSpan
}

const NodeSheetCpt = ({ node }: { node: Node }) => {
	const { network, applyAction } = useNetworkStore(
		pick('network', 'applyAction')
	)
	const { setContent } = useSheetStore(pick('setContent'))

	const getNode = useCallback(
		(id: number) => {
			const node = network.nodes[id.toString()]
			if (!node) throw new Error(`Node ${id} not found`)

			return node
		},
		[network]
	)

	const rows = (node.cpt[0] as number[] | undefined)?.length
	if (!rows) throw new Error(`Empty CPT for node ${node.id}`)

	const parents = useMemo(
		() =>
			[...node.parents].reverse().map(parentId => {
				const parent = getNode(parentId)
				const rowSpan = getRowSpan(node, parent, getNode)

				return { parent, rowSpan }
			}),
		[getNode, node]
	)

	return (
		<div className="flex flex-col gap-2">
			<h3>CPT</h3>
			<div className="overflow-x-auto" style={{ transform: 'rotateX(180deg)' }}>
				<table
					className={cx(styles.table, 'w-full table-fixed')}
					style={{ transform: 'rotateX(180deg)' }}
				>
					<tbody>
						<tr>
							{parents.map(({ parent }) => (
								<th key={parent.id} className="min-w-[50px] max-w-[150px] px-3">
									<button
										className="hover:underline"
										onClick={() => {
											setContent(<NodeSheet id={parent.id} />)
										}}
									>
										{parent.name}
									</button>
								</th>
							))}
							{node.values.map((_value, valueIndex) => (
								<th key={valueIndex} className="w-[150px]">
									<NodeSheetValue node={node} valueIndex={valueIndex} />
								</th>
							))}
							<th className="w-[40px]">
								<button
									className="w-full text-xl text-sky-500"
									onClick={() => {
										applyAction(addNodeValue(node.id))
									}}
								>
									<FontAwesomeIcon icon={faPlus} />
								</button>
							</th>
						</tr>
						{new Array(rows).fill(undefined).map((_row, cptValueIndex) => (
							<tr key={cptValueIndex}>
								{parents.map(({ parent, rowSpan }) => {
									const valueIndex =
										(cptValueIndex / rowSpan) % parent.values.length
									if (!Number.isInteger(valueIndex)) return null

									return (
										<th key={parent.id} className="px-3" rowSpan={rowSpan}>
											{parent.values[valueIndex]}
										</th>
									)
								})}
								{node.values.map((_value, valueIndex) => (
									<td key={valueIndex}>
										<NodeSheetCptValue
											node={node}
											valueIndex={valueIndex}
											cptValueIndex={cptValueIndex}
										/>
									</td>
								))}
								<th />
							</tr>
						))}
						<tr>
							{parents.map((_parent, parentIndex) => (
								<th key={parentIndex} />
							))}
							{node.cpt.map((_row, valueIndex) => (
								<th key={valueIndex}>
									<button
										className="w-full text-xl text-red-500"
										onClick={() => {
											applyAction(removeNodeValue(node.id, valueIndex))
										}}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</th>
							))}
							<th />
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default NodeSheetCpt
