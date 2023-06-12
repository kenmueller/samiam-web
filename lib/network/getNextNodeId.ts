import { Node } from '.'

const getNextNodeId = (nodes: Node[]) => {
	for (let nextId = 0; ; nextId++) {
		if (nodes.some(node => node.id === nextId)) continue
		return nextId
	}
}

export default getNextNodeId
