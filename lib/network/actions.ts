import { Draft } from 'immer'
import BeliefNetworkNode from 'samiam/lib/node'
import * as util from 'samiam/lib/util'
import Evidence from 'samiam/lib/evidence'

import Network, { AssertionType, Position, Node } from '.'
import BeliefNetworkWithNodeMap from '@/lib/beliefNetwork/withNodeMap'

export type NetworkAction = (
	network: Draft<Network>,
	beliefNetwork: BeliefNetworkWithNodeMap
) => void

export const GRID_SPACING_X = 80
export const GRID_SPACING_Y = 50

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

export const initializeBeliefNetwork = (network: Network) => {
	const beliefNetwork = new BeliefNetworkWithNodeMap()

	// add nodes
	for (const node of Object.values(network.nodes))
		beliefNetwork.nodeMap.set(
			node.id,
			BeliefNetworkNode.withIdUniformDistribution(
				node.id,
				node.name,
				beliefNetwork,
				node.values
			)
		)

	// add their parents
	for (const node of Object.values(network.nodes))
		for (const parentId of node.parents)
			beliefNetwork.nodeMap
				.get(node.id)!
				.addParent(beliefNetwork.nodeMap.get(parentId)!)

	// add CPTs
	for (const node of Object.values(network.nodes)) {
		try {
			beliefNetwork.nodeMap.get(node.id)!.setCpt(util.transpose(node.cpt))
		} catch (er) {
			console.log(node.id)
			throw er
		}
	}

	return beliefNetwork
}

export const addNode =
	({ x, y }: Position): NetworkAction =>
	(network, beliefNetwork) => {
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

		const node = BeliefNetworkNode.withIdUniformDistribution(
			id,
			`Node ${id}`,
			beliefNetwork,
			['yes', 'no']
		)
		beliefNetwork.addNode(node)
		beliefNetwork.nodeMap.set(id, node)
		network.nodes[id.toString()] = {
			id,
			name: node.name, //`Node ${id}`,
			parents: [],
			children: [],
			values: [...node.values], //['yes', 'no'],
			cpt: util.transpose(node.cpt), //[[0.5], [0.5]],
			...position
		}
	}

export const copyNode =
	(node: Node): NetworkAction =>
	(network, beliefNetwork) => {
		const id = getNextNodeId(network)

		beliefNetwork.nodeMap.set(id, beliefNetwork.nodeMap.get(node.id)!.clone(id))

		network.nodes[id.toString()] = {
			...node,
			id,
			x: node.x + GRID_SPACING_X,
			y: node.y - GRID_SPACING_Y
		}
	}

export const setNodeName =
	(id: number, name: string): NetworkAction =>
	(network, beliefNetwork) => {
		beliefNetwork.nodeMap.get(id)!.rename(name)
		network.nodes[id.toString()].name = name
	}

export const setNodeValue =
	(id: number, valueIndex: number, value: string): NetworkAction =>
	(network, beliefNetwork) => {
		beliefNetwork.nodeMap.get(id)!.setValue(valueIndex, value)
		network.nodes[id.toString()].values[valueIndex] = value
	}

export const addNodeValue =
	(id: number, name?: string): NetworkAction =>
	(network, beliefNetwork) => {
		const node = network.nodes[id.toString()]
		const beliefNetworkNode = beliefNetwork.nodeMap.get(id)!

		const valueName = name ?? `value${node.values.length}`

		beliefNetworkNode.addValue(valueName)

		node.values.push(valueName)
		node.cpt = util.transpose(beliefNetworkNode.cpt)
	}

export const removeNodeValue =
	(id: number, valueIndex: number): NetworkAction =>
	(network, beliefNetwork) => {
		const node = network.nodes[id.toString()]
		const beliefNetworkNode = beliefNetwork.nodeMap.get(id)!

		beliefNetworkNode.removeValueIndex(valueIndex)

		network.nodes[id.toString()].values.splice(valueIndex, 1)
		node.cpt = util.transpose(beliefNetworkNode.cpt)
	}

export const setNodeCptValue =
	(
		id: number,
		valueIndex: number,
		columnIndex: number,
		value: number
	): NetworkAction =>
	(network, beliefNetwork) => {
		const node = network.nodes[id.toString()]
		const beliefNetworkNode = beliefNetwork.nodeMap.get(id)!

		beliefNetworkNode.setConditionalProbabilityCell(
			columnIndex,
			valueIndex,
			value
		)

		if (node.values.length === 2)
			beliefNetworkNode.setConditionalProbabilityCell(
				columnIndex,
				1 - valueIndex,
				value
			)

		node.cpt = util.transpose(beliefNetworkNode.cpt)
	}

export const setNodePosition =
	(id: number, position: Position): NetworkAction =>
	(network, beliefNetwork) => {
		const node = network.nodes[id.toString()]

		node.x = position.x
		node.y = position.y
	}

export const snapNodeToGrid =
	(id: number): NetworkAction =>
	(network, beliefNetwork) => {
		const node = network.nodes[id.toString()]

		node.x = Math.round(node.x / GRID_SPACING_X) * GRID_SPACING_X
		node.y = Math.round(node.y / GRID_SPACING_Y) * GRID_SPACING_Y
	}

export const removeNode =
	(id: number): NetworkAction =>
	(network, beliefNetwork) => {
		const beliefNetworkNode = beliefNetwork.nodeMap.get(id)!

		beliefNetworkNode.remove()

		delete network.nodes[id.toString()]

		for (const otherNode of Object.values(network.nodes)) {
			const otherBeliefNetworkNode = beliefNetwork.nodeMap.get(otherNode.id)!

			otherNode.parents = Array.from(otherBeliefNetworkNode.parents).map(
				node => node.id as number
			)

			otherNode.children = Array.from(otherBeliefNetworkNode.children).map(
				node => node.id as number
			)

			otherNode.cpt = util.transpose(otherBeliefNetworkNode.cpt)
		}
	}

export const addEdge =
	(edge: Edge): NetworkAction =>
	(network, beliefNetwork) => {
		const parent = network.nodes[edge.from.toString()]
		const child = network.nodes[edge.to.toString()]

		const parentBeliefNetworkNode = beliefNetwork.nodeMap.get(parent.id)!
		const childBeliefNetworkNode = beliefNetwork.nodeMap.get(child.id)!

		childBeliefNetworkNode.addParent(parentBeliefNetworkNode)

		parent.children = Array.from(parentBeliefNetworkNode.children).map(
			node => node.id as number
		)

		child.parents = Array.from(childBeliefNetworkNode.parents).map(
			node => node.id as number
		)

		child.cpt = util.transpose(childBeliefNetworkNode.cpt)
	}

export const removeEdge =
	(edge: Edge): NetworkAction =>
	(network, beliefNetwork) => {
		const parent = network.nodes[edge.from.toString()]
		const child = network.nodes[edge.to.toString()]

		const parentBeliefNetworkNode = beliefNetwork.nodeMap.get(parent.id)!
		const childBeliefNetworkNode = beliefNetwork.nodeMap.get(child.id)!

		childBeliefNetworkNode.removeParent(parentBeliefNetworkNode)

		parent.children = Array.from(parentBeliefNetworkNode.children).map(
			node => node.id as number
		)
		child.parents = Array.from(childBeliefNetworkNode.parents).map(
			node => node.id as number
		)

		child.cpt = util.transpose(childBeliefNetworkNode.cpt)
	}

export const setAssertionType =
	(id: number, type: AssertionType | null): NetworkAction =>
	(network, beliefNetwork) => {
		network.nodes[id.toString()].assertionType = type ?? undefined
	}

export const setAssertedValue =
	(id: number, valueIndex: number | null): NetworkAction =>
	(network, beliefNetwork) => {
		network.nodes[id.toString()].assertedValue = valueIndex ?? undefined
	}
