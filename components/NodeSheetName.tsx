'use client'

import { ChangeEvent, useCallback } from 'react'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import { Node } from '@/lib/network'
import { setNodeName } from '@/lib/network/actions'

const NodeSheetName = ({ node }: { node: Node }) => {
	const { applyAction } = useNetworkStore(pick('applyAction'))

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			applyAction(setNodeName(node.id, event.target.value))
		},
		[node.id, applyAction]
	)

	return (
		<div className="flex flex-col gap-2">
			<h3>Name</h3>
			<input
				className="px-3 py-2 border border-gray-500 rounded-lg outline-none"
				placeholder={`Node ${node.id}`}
				value={node.name}
				onChange={onNameChange}
			/>
		</div>
	)
}

export default NodeSheetName
