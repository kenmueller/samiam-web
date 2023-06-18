import { Draft } from 'immer'

import Network, { AssertionType, Position } from '.'

export type NetworkAction = (network: Draft<Network>) => void

const GRID_SPACING_X = 80
const GRID_SPACING_Y = 50

export interface Edge {
	from: number
	to: number
}

const getNextNodeId = (network: Network) => {
	for (let nextId = 0; ; nextId++) {
		if (nextId.toString() in network.nodes) continue
		return nextId
	}
}

export const addNode =
	({ x, y }: Position): NetworkAction =>
	network => {
		const position: Position = {
			x: Math.round(x / GRID_SPACING_X) * GRID_SPACING_X,
			y: Math.round(y / GRID_SPACING_Y) * GRID_SPACING_Y
		}

		if (
			Object.values(network.nodes).some(
				node => node.x === position.x && node.y === position.y
			)
		)
			throw new Error('Node already exists at this position')

		const id = getNextNodeId(network)

		network.nodes[id.toString()] = {
			id,
			name: `Node ${id}`,
			parents: [],
			children: [],
			values: ['yes', 'no'],
			cpt: [[0.5], [0.5]],
			...position
		}
	}

export const setNodeName =
	(id: number, name: string): NetworkAction =>
	network => {
		network.nodes[id.toString()].name = name
	}

export const setNodeValue =
	(id: number, valueIndex: number, value: string): NetworkAction =>
	network => {
		network.nodes[id.toString()].values[valueIndex] = value
	}

export const addNodeValue =
	(id: number): NetworkAction =>
	network => {
		const node = network.nodes[id.toString()]

		const cptValues = (node.cpt[0] as number[] | undefined)?.length
		if (cptValues === undefined) throw new Error('CPT is empty')

		node.values.push(`value${node.values.length}`)
		node.cpt.push(new Array(cptValues).fill(0))
	}

export const removeNodeValue =
	(id: number, valueIndex: number): NetworkAction =>
	network => {
		network.nodes[id.toString()].values.splice(valueIndex, 1)
	}

export const setNodeCptValue =
	(
		id: number,
		valueIndex: number,
		columnIndex: number,
		value: number
	): NetworkAction =>
	network => {
		network.nodes[id.toString()].cpt[valueIndex][columnIndex] = value
	}

export const setNodePosition =
	(id: number, position: Position): NetworkAction =>
	network => {
		const node = network.nodes[id.toString()]

		node.x = position.x
		node.y = position.y
	}

export const snapNodeToGrid =
	(id: number): NetworkAction =>
	network => {
		const node = network.nodes[id.toString()]

		node.x = Math.round(node.x / GRID_SPACING_X) * GRID_SPACING_X
		node.y = Math.round(node.y / GRID_SPACING_Y) * GRID_SPACING_Y
	}

export const removeNode =
	(id: number): NetworkAction =>
	network => {
		delete network.nodes[id.toString()]

		for (const otherNode of Object.values(network.nodes))
			otherNode.parents = otherNode.parents.filter(parentId => parentId !== id)
	}

export const addEdge =
	(edge: Edge): NetworkAction =>
	network => {
		if (edge.from === edge.to) throw new Error('Cannot connect node to itself')

		const parent = network.nodes[edge.from.toString()]
		const child = network.nodes[edge.to.toString()]

		if (child.parents.includes(parent.id))
			throw new Error('Edge already exists')

		child.parents.push(parent.id)

		child.cpt = child.cpt.map(row =>
			new Array(parent.values.length).fill(row).flat()
		)
	}

export const removeEdge =
	(edge: Edge): NetworkAction =>
	network => {
		const child = network.nodes[edge.to.toString()]
		child.parents = child.parents.filter(parentId => parentId !== edge.from)
	}

export const setAssertionType =
	(id: number, type: AssertionType | null): NetworkAction =>
	network => {
		network.nodes[id.toString()].assertionType = type ?? undefined
	}

export const setAssertedValue =
	(id: number, valueIndex: number | null): NetworkAction =>
	network => {
		network.nodes[id.toString()].assertedValue = valueIndex ?? undefined
	}
