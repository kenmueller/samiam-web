import { Draft } from 'immer'

import Network, { Position } from '.'

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
