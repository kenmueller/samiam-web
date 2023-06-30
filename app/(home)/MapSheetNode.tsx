'use client'

import { ChangeEvent, useCallback, useId } from 'react'

import NodeName from './NodeName'
import { MapNode } from './MapSheet'

const MapSheetNode = ({
	mapNode,
	selected,
	setSelected
}: {
	mapNode: MapNode
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

	const valueIndex = mapNode.instantiation?.value ?? mapNode.node.assertedValue

	return (
		<tr>
			<td>
				{!['observation', 'intervention'].includes(mapNode.type) && (
					<div className="flex justify-center items-center h-full">
						<input
							id={id}
							type="checkbox"
							checked={selected}
							disabled={mapNode.hasEvidence}
							onChange={onChange}
						/>
					</div>
				)}
			</td>
			<td className="max-w-[115px]">
				<label htmlFor={id}>
					<NodeName id={mapNode.node.id} name={mapNode.node.name} />
				</label>
			</td>
			<td className="max-w-[115px]">
				{valueIndex !== undefined && mapNode.node.values[valueIndex]}
			</td>
		</tr>
	)
}

export default MapSheetNode
