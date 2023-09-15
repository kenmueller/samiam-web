'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import { Node } from '@/lib/network'
import { setNodeName } from '@/lib/network/actions'
import errorFromUnknown from '@/lib/error/fromUnknown'

const NodeSheetName = ({ node }: { node: Node }) => {
	const { applyAction } = useNetworkStore(pick('applyAction'))

	const [name, setName] = useState(node.name)
	const [error, setError] = useState<Error | null>(null)

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			try {
				const name = event.target.value

				setName(name)
				applyAction(setNodeName(node.id, name))

				setError(null)
			} catch (unknownError) {
				setError(errorFromUnknown(unknownError))
			}
		},
		[setName, node.id, applyAction]
	)

	useEffect(() => {
		setName(node.name)
		setError(null)
	}, [node.name, setName, setError])

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<h3>Name</h3>
				{error && (
					<div data-balloon-pos="up-left" aria-label={error.message}>
						<FontAwesomeIcon
							className="text-xl text-raspberry"
							icon={faTriangleExclamation}
						/>
					</div>
				)}
			</div>
			<input
				className="px-3 py-2 border border-gray-500 rounded-lg outline-none"
				placeholder={`Node ${node.id}`}
				value={name}
				onChange={onNameChange}
			/>
		</div>
	)
}

export default NodeSheetName
