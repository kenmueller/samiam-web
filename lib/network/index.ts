export interface Position {
	x: number
	y: number
}

export interface Node extends Position {
	id: number
	name: string
	parents: number[]
	values: string[]
	assertedValue?: number
	cpt: number[][]
}

export default interface Network {
	nodes: Node[]
}
