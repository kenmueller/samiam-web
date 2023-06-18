export interface Position {
	x: number
	y: number
}

export type AssertionType = 'observation' | 'intervention'

export interface Node extends Position {
	id: number
	name: string
	parents: number[]
	values: string[]
	assertionType?: AssertionType
	assertedValue?: number
	cpt: number[][]
}

export default interface Network {
	nodes: Node[]
}
