export interface Node {
	id: number
	x: number
	y: number
}

export interface Edge {
	from: number
	to: number
}

export default interface Network {
	nodes: Node[]
	edges: Edge[]
}
