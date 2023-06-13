'use client'

import { useCallback, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { Node } from '@/lib/network'
import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'

import styles from './NodeSheetCpt.module.scss'

const getColSpan = (
	child: Node,
	parent: Node,
	getNode: (id: number) => Node
) => {
	let colSpan = 1

	for (const otherParentId of child.parents) {
		if (otherParentId === parent.id) break
		colSpan *= getNode(otherParentId).values.length
	}

	return colSpan
}

const NodeSheetCpt = ({ node }: { node: Node }) => {
	const { network, setNodeCptValue } = useNetworkStore(
		pick('network', 'setNodeCptValue')
	)

	const getNode = useCallback(
		(id: number) => {
			const node = network.nodes.find(node => node.id === id)
			if (!node) throw new Error(`Node ${id} not found`)

			return node
		},
		[network]
	)

	const reversedParents = useMemo(
		() => [...node.parents].reverse(),
		[node.parents]
	)

	const columns = (node.cpt[0] as number[] | undefined)?.length
	if (!columns) throw new Error(`Empty CPT for node ${node.id}`)

	return (
		<table className={styles.table}>
			<tbody>
				{reversedParents.map(parentId => {
					const parent = getNode(parentId)
					const colSpan = getColSpan(node, parent, getNode)
					const repeat = columns / (colSpan * parent.values.length)

					return (
						<tr key={parent.id}>
							<th>{parent.name}</th>
							{new Array(repeat)
								.fill(undefined)
								.map((_repeatValue, repeatIndex) =>
									parent.values.map((value, valueIndex) => (
										<th key={`${repeatIndex}-${valueIndex}`} colSpan={colSpan}>
											{value}
										</th>
									))
								)}
							<th />
						</tr>
					)
				})}
				{node.values.map((value, valueIndex) => (
					<tr key={valueIndex}>
						<th>{value}</th>
						{node.cpt[valueIndex].map((cptValue, columnIndex) => (
							<td key={columnIndex}>
								<input
									className="w-full px-2 py-1 outline-none"
									type="number"
									placeholder="CPT Value"
									min={0}
									max={1}
									value={cptValue}
									onChange={event => {
										const newCptValue = Number.parseFloat(event.target.value)
										if (Number.isNaN(newCptValue)) return

										setNodeCptValue(
											node.id,
											valueIndex,
											columnIndex,
											newCptValue
										)
									}}
								/>
							</td>
						))}
						<th>
							<button>
								<FontAwesomeIcon icon={faTrash} />
							</button>
						</th>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default NodeSheetCpt
