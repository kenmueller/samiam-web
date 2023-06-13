'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { Node } from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'

const NodeSheetValue = ({
	node,
	valueIndex
}: {
	node: Node
	valueIndex: number
}) => {
	const { value, setNodeValue } = useNetworkStore(state => ({
		value:
			state.network.nodes.find(otherNode => otherNode.id === node.id)?.values[
				valueIndex
			] ?? null,
		setNodeValue: state.setNodeValue
	}))

	if (typeof value !== 'string') throw new Error('Node value not found')

	const onNodeValueChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setNodeValue(node.id, valueIndex, event.target.value)
		},
		[setNodeValue, node.id, valueIndex]
	)

	return (
		<input
			className="w-full px-2 py-1 text-center outline-none bg-transparent"
			placeholder="Unnamed"
			value={value}
			onChange={onNodeValueChange}
		/>
	)
}

export default NodeSheetValue
