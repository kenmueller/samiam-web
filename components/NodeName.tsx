import { memo } from 'react'

import renderTextWithMath from '@/lib/renderTextWithMath'

const NodeName = memo(({ id, name }: { id: number; name: string }) => (
	<span
		className="font-bold"
		dangerouslySetInnerHTML={{
			__html: name ? renderTextWithMath(name) : `Node ${id}`
		}}
	/>
))

NodeName.displayName = 'NodeName'

export default NodeName
