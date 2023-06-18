'use client'

import cx from 'classnames'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import { Node } from '@/lib/network'
import { setAssertedValue, setAssertionType } from '@/lib/network/actions'

const NodeSheetAssert = ({ node }: { node: Node }) => {
	const { applyAction } = useNetworkStore(pick('applyAction'))

	const selectedStyle =
		node.assertionType === 'observation'
			? 'bg-yellow-500 bg-opacity-50 border-yellow-500'
			: node.assertionType === 'intervention'
			? 'bg-sky-500 bg-opacity-50 border-sky-500'
			: (undefined as never)

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
								: 'border-gray-500'
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
			<div
				className={cx(
					'flex items-center gap-2 flex-wrap',
					node.assertionType === undefined && 'opacity-50 pointer-events-none'
				)}
			>
				{node.values.map((value, valueIndex) => (
					<button
						key={valueIndex}
						className={cx(
							'px-3 py-1.5 border rounded-md transition-colors ease-linear',
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
			</div>
		</div>
	)
}

export default NodeSheetAssert
