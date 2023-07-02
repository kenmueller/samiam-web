'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import clamp from 'lodash/clamp'

import { Node } from '@/lib/network'
import useNetworkStore from '@/lib/stores/network'
import { setNodeCptValue } from '@/lib/network/actions'
import pick from '@/lib/pick'

const zero = [9, 174, 106]
const one = [217, 253, 238]
const zeroInvalid = [240, 209, 222]
const oneInvalid = [195, 70, 122]
const diff = one.map((x, i) => x - zero[i])
const diffInvalid = oneInvalid.map((x, i) => x - zeroInvalid[i])

const NodeSheetCptValue = ({
	node,
	isValid,
	rowIndex,
	valueIndex
}: {
	node: Node
	isValid: boolean
	rowIndex: number
	valueIndex: number
}) => {
	const cptValue = node.cpt[rowIndex][valueIndex]
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
						rowIndex,
						valueIndex,
						clamp(newCptValue, 0, 1)
					)
				)
		},
		[_setCptValue, applyAction, node.id, rowIndex, valueIndex]
	)

	const prob = clamp(cptValue, 0, 1)

	return (
		<div
			className="relative"
			style={{
				background: `rgb(${
					isValid
						? zero.map((z, i) => z + diff[i] * prob)
						: zeroInvalid.map((z, i) => z + diffInvalid[i] * prob)
				})`
			}}
		>
			<span className="px-4 invisible whitespace-nowrap" aria-hidden>
				{_cptValue}
			</span>
			<input
				className="w-full px-2 py-0 bg-transparent outline-none transition-colors ease-linear absolute left-0 inset-0"
				type="number"
				step={0.01}
				min={0}
				max={1}
				placeholder={cptValue.toString()}
				value={_cptValue}
				onChange={_onCptValueChange}
			/>
		</div>
	)
}

export default NodeSheetCptValue
