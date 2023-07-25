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
	monitor?: true
}

export type EliminationOrderHeuristic = 'min-fill' | 'min-size'

export default interface Network {
	name: string | null
	eliminationOrderHeuristic: EliminationOrderHeuristic
	nodes: Record<string, Node>
}

export interface NetworkMeta {
	id: string
	name: string | null
	user: string
}
