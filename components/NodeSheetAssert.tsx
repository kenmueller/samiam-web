'use client'

import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useCallback } from 'react'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import { Node } from '@/lib/network'
import {
	addNodeValue,
	setAssertedValue,
	setAssertionType
} from '@/lib/network/actions'

const NodeSheetAssert = ({ node }: { node: Node }) => {
	const { applyAction } = useNetworkStore(pick('applyAction'))

	const selectedStyle =
		node.assertionType === 'observation'
			? 'bg-gold-100 bg-opacity-50 border-gold-500'
			: node.assertionType === 'intervention'
			? 'bg-uranian bg-opacity-50 border-uranian-400'
			: (undefined as never)

	const onAddValue = useCallback(() => {
		const value = prompt('New Value')
		if (!value) return

		applyAction(addNodeValue(node.id, value))
	}, [applyAction, node.id])

	return (
		<div className="flex flex-col gap-2">
			<h3>Assert Evidence</h3>
			<h4>Type</h4>
			<div className="flex items-center gap-2 flex-wrap">
				{(['observation', 'intervention'] as const).map(assertionType => (
					<button
						key={assertionType}
						className={cx(
							'px-3 py-1.5 border rounded-md transition-colors ease-linear',
							node.assertionType === assertionType
								? selectedStyle
								: 'border-charcoal-400'
						)}
						onClick={() => {
							applyAction(
								setAssertionType(
									node.id,
									node.assertionType === assertionType ? null : assertionType
								)
							)
						}}
					>
						{assertionType}
					</button>
				))}
			</div>
			<h4>Value</h4>
			<div className={cx('flex items-center gap-2 flex-wrap')}>
				{node.values.map((value, valueIndex) => (
					<button
						key={valueIndex}
						disabled={node.assertionType === undefined}
						className={cx(
							'px-3 py-1.5 border rounded-md transition-colors ease-linear disabled:opacity-50',
							node.assertedValue === valueIndex
								? selectedStyle
								: 'border-gray-500'
						)}
						onClick={() => {
							applyAction(
								setAssertedValue(
									node.id,
									node.assertedValue === valueIndex ? null : valueIndex
								)
							)
						}}
					>
						{value}
					</button>
				))}
				<button
					className="flex justify-center items-center gap-2 w-[37.33px] h-[37.33px] bg-charcoal-50 border border-gray-500 rounded-md"
					onClick={onAddValue}
				>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
		</div>
	)
}

export default NodeSheetAssert
