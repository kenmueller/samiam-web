'use client'

import { Node } from '@/lib/network'
import pick from '@/lib/pick'
import useOptionStore from '@/lib/stores/option'

const NetworkNode = ({ node }: { node: Node }) => {
	const { option } = useOptionStore(pick('option'))

	return (
		<div
			key={node.id}
			className="absolute px-4 py-2 bg-sky-500 rounded-[100%] -translate-x-1/2 -translate-y-1/2"
			style={{ left: node.x, top: node.y }}
		>
			<p className="whitespace-nowrap">{node.name}</p>
		</div>
	)
}

export default NetworkNode
