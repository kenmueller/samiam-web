'use client'

import { useCallback, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import { Node } from '@/lib/network'
import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import NodeSheetCptValue from './NodeSheetCptValue'
import useSheetStore from '@/lib/stores/sheet'
import NodeSheet from './NodeSheet'

import styles from './NodeSheetCpt.module.scss'

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
	const { network, setNodeCptValue } = useNetworkStore(
		pick('network', 'setNodeCptValue')
	)
	const { setContent } = useSheetStore(pick('setContent'))

	const getNode = useCallback(
		(id: number) => {
			const node = network.nodes.find(node => node.id === id)
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
		<table className={styles.table}>
			<tbody>
				<tr>
					{parents.map(({ parent }) => (
						<th key={parent.id}>
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
					{node.values.map((value, valueIndex) => (
						<th key={valueIndex}>{value}</th>
					))}
					<th>
						<button className="text-sky-500">
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
								<th key={parent.id} rowSpan={rowSpan}>
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
					{node.cpt.map((_row, cptValueIndex) => (
						<th key={cptValueIndex}>
							<button className="text-red-500">
								<FontAwesomeIcon icon={faTrash} />
							</button>
						</th>
					))}
					<th />
				</tr>
			</tbody>
		</table>
	)
}

export default NodeSheetCpt
