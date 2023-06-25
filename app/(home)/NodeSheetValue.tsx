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
		<div
			className="inline-grid after:min-w-[1em] after:row-start-1 after:col-start-2 after:px-2 after:pr-6 after:py-1 after:content-[attr(data-value)'\0020'] after:invisible after:whitespace-nowrap"
			data-value={value}
		>
			<input
				className="w-full px-2 py-1 text-center outline-none bg-transparent min-w-[1em] row-start-1 col-start-2"
				placeholder="Unnamed"
				value={value}
				onChange={onNodeValueChange}
			/>
		</div>
	)
}

export default NodeSheetValue
