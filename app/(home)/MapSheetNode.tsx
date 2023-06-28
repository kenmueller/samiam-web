'use client'

import { ChangeEvent, useCallback, useId } from 'react'

import { Node } from '@/lib/network'

const MapSheetNode = ({
	node,
	selected,
	setSelected
}: {
	node: Node
	selected: boolean
	setSelected: (selected: boolean) => void
}) => {
	const id = useId()

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSelected(event.target.checked)
		},
		[setSelected]
	)

	return (
		<div className="flex items-center gap-2">
			<input id={id} type="checkbox" checked={selected} onChange={onChange} />
			<label htmlFor={id}>{node.name}</label>
		</div>
	)
}

export default MapSheetNode
