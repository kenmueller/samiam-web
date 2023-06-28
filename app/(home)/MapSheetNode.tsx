'use client'

import { ChangeEvent, useCallback, useId } from 'react'
import cx from 'classnames'
import Instantiation from 'samiam/lib/instantiation'

import { Node } from '@/lib/network'
import NodeName from './NodeName'

const MapSheetNode = ({
	node,
	instantiations,
	selected,
	setSelected
}: {
	node: Node
	instantiations: Instantiation[]
	selected: boolean
	setSelected: (selected: boolean) => void
}) => {
	const id = useId()

	const hasEvidence =
		node.assertionType !== undefined && node.assertedValue !== undefined

	const instantiation = hasEvidence
		? null
		: instantiations.find(instantiation => instantiation.node.id === node.id)!

	const type = node.assertionType ?? (instantiation ? 'map' : null)

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSelected(event.target.checked)
		},
		[setSelected]
	)

	return (
		<div className="flex items-center gap-2">
			<input
				id={id}
				type="checkbox"
				checked={selected}
				disabled={hasEvidence}
				onChange={onChange}
			/>
			<label className={cx(hasEvidence && 'opacity-50')} htmlFor={id}>
				{type && <span>({type}) </span>}
				{node.assertionType === 'intervention' &&
					node.assertedValue !== undefined && (
						<>
							<span className="italic">do</span>
							<span>(</span>
						</>
					)}
				<NodeName id={node.id} name={node.name} />
				{instantiation && <span> = {node.values[instantiation.value]}</span>}
				{node.assertionType !== undefined &&
					node.assertedValue !== undefined && (
						<span> = {node.values[node.assertedValue]}</span>
					)}
				{node.assertionType === 'intervention' &&
					node.assertedValue !== undefined && <span>)</span>}
			</label>
		</div>
	)
}

export default MapSheetNode
