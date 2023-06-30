'use client'

import { ChangeEvent, useCallback } from 'react'

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
		<span className="relative">
			<span className="px-4 invisible whitespace-nowrap" aria-hidden>
				{value}
			</span>
			<input
				className="bg-gray-200 w-full px-2 py-0 text-center outline-none absolute left-0 inset-0"
				placeholder="Unnamed"
				value={value}
				onChange={onNodeValueChange}
			/>
		</span>
	)
}

export default NodeSheetValue
