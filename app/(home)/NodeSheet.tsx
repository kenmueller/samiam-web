'use client'

import { useEffect } from 'react'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import useSheetStore from '@/lib/stores/sheet'
import { Node } from '@/lib/network'
import NodeSheetName from './NodeSheetName'
import NodeSheetAssert from './NodeSheetAssert'
import NodeSheetCpt from './NodeSheetCpt'
import NodeSheetMonitorToggle from './NodeSheetMonitorToggle'

const NodeSheet = ({ id }: { id: number }) => {
	const { close } = useSheetStore(pick('close'))
	const { node } = useNetworkStore(state => ({
		node: (state.network.nodes[id.toString()] as Node | undefined) ?? null
	}))

	const nodeExists = !!node

	useEffect(() => {
		if (!nodeExists) close()
	}, [nodeExists, close])

	return node && <NodeSheetWithNode node={node} />
}

const NodeSheetWithNode = ({ node }: { node: Node }) => (
	<div className="flex flex-col items-stretch gap-4">
		<NodeSheetMonitorToggle node={node} />
		<NodeSheetName node={node} />
		<NodeSheetAssert node={node} />
		<NodeSheetCpt node={node} />
	</div>
)

export default NodeSheet
