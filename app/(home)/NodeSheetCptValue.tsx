'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { Node } from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'
import { setNodeCptValue } from '@/lib/network/actions'
import pick from '@/lib/pick'

const NodeSheetCptValue = ({
	node,
	valueIndex,
	cptValueIndex
}: {
	node: Node
	valueIndex: number
	cptValueIndex: number
}) => {
	const cptValue = node.cpt[valueIndex][cptValueIndex]
	if (typeof cptValue !== 'number') throw new Error(`CPT value not found`)

	const { applyAction } = useNetworkStore(pick('applyAction'))

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
				applyAction(
					setNodeCptValue(node.id, valueIndex, cptValueIndex, newCptValue)
				)
		},
		[_setCptValue, applyAction, node.id, valueIndex, cptValueIndex]
	)

	return (
		<input
			className="w-full px-2 py-1 outline-none bg-transparent"
			placeholder={cptValue.toString()}
			value={_cptValue}
			onChange={_onCptValueChange}
		/>
	)
}

export default NodeSheetCptValue
