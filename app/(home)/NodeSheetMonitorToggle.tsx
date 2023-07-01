'use client'

import { ChangeEvent, useCallback, useId } from 'react'

import { Node } from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'
import pick from '@/lib/pick'
import { setMonitorShowing } from '@/lib/network/actions'

const NodeSheetMonitorToggle = ({ node }: { node: Node }) => {
	const id = useId()

	const { applyAction } = useNetworkStore(pick('applyAction'))

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			applyAction(setMonitorShowing(node.id, event.target.checked))
		},
		[applyAction, node.id]
	)

	return (
		<div className="flex items-center gap-2">
			<input
				id={id}
				type="checkbox"
				checked={node.monitor ?? false}
				onChange={onChange}
			/>
			<label htmlFor={id}>Show Monitor</label>
		</div>
	)
}

export default NodeSheetMonitorToggle
