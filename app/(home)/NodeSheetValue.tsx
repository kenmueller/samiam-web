'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { Node } from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'
import pick from '@/lib/pick'
import { setNodeValue } from '@/lib/network/actions'

const NodeSheetValue = ({
	node,
	valueIndex
}: {
	node: Node
	valueIndex: number
}) => {
	const value = node.values[valueIndex]
	if (typeof value !== 'string') throw new Error('Node value not found')

	const { applyAction } = useNetworkStore(pick('applyAction'))

	const onNodeValueChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			applyAction(setNodeValue(node.id, valueIndex, event.target.value))
		},
		[applyAction, node.id, valueIndex]
	)

	return (
		<input
			className="w-full min-w-[100px] px-2 py-1 text-center outline-none bg-transparent"
			placeholder="Unnamed"
			value={value}
			onChange={onNodeValueChange}
		/>
	)
}

export default NodeSheetValue
