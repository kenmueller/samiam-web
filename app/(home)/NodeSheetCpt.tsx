'use client'

import { useCallback, useMemo } from 'react'

import { Node } from '@/lib/network'
import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'

const NodeSheetCpt = ({ node }: { node: Node }) => {
	const { network } = useNetworkStore(pick('network'))

	const getNode = useCallback(
		(id: number) => {
			const node = network.nodes.find(node => node.id === id)
			if (!node) throw new Error(`Node ${id} not found`)

			return node
		},
		[network]
	)

	const parentsList = useMemo(() => {}, [])

	return (
		<table>
			<tbody>
				{node.parents.map(parentId => {
					const parent = getNode(parentId)

					return (
						<tr key={parent.id}>
							<th>{parent.name}</th>
							{parent.values.map(value => (
								<th key={value}>{value}</th>
							))}
						</tr>
					)
				})}
				{node.values.map((value, valueIndex) => (
					<tr key={value}>
						<th>{value}</th>
						{node.cpt[valueIndex].map((cptValue, cptValueIndex) => (
							<th key={cptValueIndex}>{cptValue}</th>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default NodeSheetCpt
