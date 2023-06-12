'use client'

import { ChangeEvent, useCallback } from 'react'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import { Node } from '@/lib/network'

const NodeSheetName = ({ node }: { node: Node }) => {
	const { setNodeName } = useNetworkStore(pick('setNodeName'))

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setNodeName(node.id, event.target.value)
		},
		[node.id, setNodeName]
	)

	return (
		<input
			className="px-3 py-2 border border-gray-500 rounded-lg outline-none"
			placeholder={`Node ${node.id}`}
			value={node.name}
			onChange={onNameChange}
		/>
	)
}

export default NodeSheetName
