'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import clamp from 'lodash/clamp'

import { Node } from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'
import { setNodeCptValue } from '@/lib/network/actions'
import pick from '@/lib/pick'

const zero = [9, 174, 106]
const one = [217, 253, 238]
const diff = one.map((x, i) => x - zero[i])

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
					setNodeCptValue(
						node.id,
						valueIndex,
						cptValueIndex,
						clamp(newCptValue, 0, 1)
					)
				)
		},
		[_setCptValue, applyAction, node.id, valueIndex, cptValueIndex]
	)

	const prob = clamp(cptValue, 0, 1)

	return (
		<input
			className="w-full px-2 py-1 outline-none transition-colors ease-linear"
			style={{
				// from 179, 250, 221 (aquamarine) to 15, 230, 140 (spring green)
				background: `rgb(${zero.map((z, i) => z + diff[i] * prob)})`
			}}
			type="number"
			step={0.01}
			min={0}
			max={1}
			placeholder={cptValue.toString()}
			value={_cptValue}
			onChange={_onCptValueChange}
		/>
	)
}

export default NodeSheetCptValue
