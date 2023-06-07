'use client'

import { MouseEvent, useCallback } from 'react'

import useNetworkStore from '@/lib/stores/network'
import useOptionStore from '@/lib/stores/option'
import pick from '@/lib/pick'

const Main = () => {
	const { network, addNode } = useNetworkStore(pick('network', 'addNode'))
	const { option } = useOptionStore(pick('option'))

	const onClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			switch (option) {
				case 'add-node':
					addNode({ x: event.clientX, y: event.clientY })
					break
			}
		},
		[option, addNode]
	)

	return (
		<main className="absolute inset-0 overflow-hidden z-0" onClick={onClick}>
			{network.nodes.map(node => (
				<div
					key={node.id}
					className="absolute px-4 py-2 bg-sky-500 rounded-[100%] -translate-x-1/2 -translate-y-1/2"
					style={{ left: node.x, top: node.y }}
				>
					<p className="whitespace-nowrap">{node.name}</p>
				</div>
			))}
		</main>
	)
}

export default Main
