import { Node } from '.'

const getNextNodeId = (nodes: Node[]) => {
	let nextId = 0

	for (const node of nodes) {
		if (node.id !== nextId) break
		nextId++
	}

	return nextId
}

export default getNextNodeId
