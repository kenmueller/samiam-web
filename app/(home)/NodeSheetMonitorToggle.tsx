'use client'

import { ChangeEvent, useCallback, useId } from 'react'

import { Node } from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'
import pick from '@/lib/pick'
import { setMonitorShowing } from '@/lib/network/actions'

const NodeSheetMonitorToggle = ({ node }: { node: Node }) => {
	const id = useId()

	const { applyAction, isPrior } = useNetworkStore(state => ({
		applyAction: state.applyAction,
		isPrior: !Object.values(state.network.nodes).some(
			node =>
				node.assertionType !== undefined && node.assertedValue !== undefined
		)
	}))

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
			<label htmlFor={id}>
				Show {isPrior ? 'Prior' : 'Posterior'} Marginal Distribution
			</label>
		</div>
	)
}

export default NodeSheetMonitorToggle
