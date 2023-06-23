export interface Position {
	x: number
	y: number
}

export interface Bounds {
	from: Position
	to: Position
}

export type AssertionType = 'observation' | 'intervention'

export interface Node extends Position {
	id: number
	name: string
	parents: number[]
	children: number[]
	values: string[]
	assertionType?: AssertionType
	assertedValue?: number
	cpt: number[][]
}

export default interface Network {
	nodes: Record<string, Node>
}
