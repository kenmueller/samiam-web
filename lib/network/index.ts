export interface Position {
	x: number
	y: number
}

export interface Node extends Position {
	id: number
	name: string
}

export interface Edge {
	from: number
	to: number
}

export default interface Network {
	nodes: Node[]
	edges: Edge[]
}
