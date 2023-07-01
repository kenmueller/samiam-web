'use client'

import NodeName from './NodeName'
import { MpeNode } from './MpeSheet'

const MpeSheetNode = ({ mpeNode }: { mpeNode: MpeNode }) => {
	const valueIndex = mpeNode.instantiation?.value ?? mpeNode.node.assertedValue

	return (
		<tr>
			<td className="max-w-[115px]">
				<NodeName id={mpeNode.node.id} name={mpeNode.node.name} />
			</td>
			<td className="max-w-[115px]">
				{valueIndex !== undefined && mpeNode.node.values[valueIndex]}
			</td>
		</tr>
	)
}

export default MpeSheetNode
