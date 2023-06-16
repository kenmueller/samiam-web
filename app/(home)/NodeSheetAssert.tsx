'use client'

import cx from 'classnames'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import { Node } from '@/lib/network'

const NodeSheetAssert = ({ node }: { node: Node }) => {
	const { setAssertedValue } = useNetworkStore(pick('setAssertedValue'))

	return (
		<div className="flex flex-col gap-2">
			<h3>Assert Evidence</h3>
			<div className="flex items-center gap-2 flex-wrap">
				{node.values.map((value, valueIndex) => (
					<button
						key={valueIndex}
						className={cx(
							'px-3 py-1.5 border rounded-md',
							node.assertedValue === valueIndex
								? 'bg-sky-500 bg-opacity-50 border-sky-500'
								: 'border-gray-500'
						)}
						onClick={() => {
							setAssertedValue(
								node.id,
								node.assertedValue === valueIndex ? null : valueIndex
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
