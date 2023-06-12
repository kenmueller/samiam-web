'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import { Node } from '@/lib/network'

const NodeSheetName = ({ node }: { node: Node }) => {
	const { setNodeName } = useNetworkStore(pick('setNodeName'))

	const [rawName, setRawName] = useState(node.name)

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const newRawName = event.target.value
			setRawName(newRawName)

			const newName = newRawName.trim()
			if (newName) setNodeName(node.id, newName)
		},
		[node.id, setRawName, setNodeName]
	)

	useEffect(() => {
		setRawName(node.name)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setRawName, node.id])

	return (
		<input
			className="px-3 py-2 border border-gray-500 rounded-lg outline-none"
			placeholder="Name"
			value={rawName}
			onChange={onNameChange}
		/>
	)
}

export default NodeSheetName
