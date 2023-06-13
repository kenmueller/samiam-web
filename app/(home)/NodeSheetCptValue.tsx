'use client'

import { Node } from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

const NodeSheetCptValue = ({
	node,
	valueIndex,
	columnIndex
}: {
	node: Node
	valueIndex: number
	columnIndex: number
}) => {
	const { cptValue, setNodeCptValue } = useNetworkStore(state => ({
		cptValue:
			state.network.nodes.find(otherNode => otherNode.id === node.id)?.cpt[
				valueIndex
			][columnIndex] ?? null,
		setNodeCptValue: state.setNodeCptValue
	}))

	if (typeof cptValue !== 'number') throw new Error(`CPT value not found`)

	const [_cptValue, _setCptValue] = useState(cptValue?.toString())

	useEffect(() => {
		_setCptValue(_cptValue =>
			Number.parseFloat(_cptValue) === cptValue
				? _cptValue
				: cptValue.toString()
		)
	}, [cptValue, _setCptValue])

	const _onCptValueChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const _newCptValue = event.target.value
			_setCptValue(_newCptValue)

			const newCptValue = Number.parseFloat(_newCptValue)

			if (!Number.isNaN(newCptValue))
				setNodeCptValue(node.id, valueIndex, columnIndex, newCptValue)
		},
		[_setCptValue, setNodeCptValue, node.id, valueIndex, columnIndex]
	)

	return (
		<input
			className="w-full px-2 py-1 outline-none"
			placeholder={cptValue.toString()}
			value={_cptValue}
			onChange={_onCptValueChange}
		/>
	)
}

export default NodeSheetCptValue
