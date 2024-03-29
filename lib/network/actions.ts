import { Draft } from 'immer'
import BeliefNetworkNode from 'samiam/lib/node'
import * as util from 'samiam/lib/util'
import cloneDeep from 'lodash/cloneDeep'

import Network, {
	AssertionType,
	Position,
	Node,
	EliminationOrderHeuristic
} from '.'
import BeliefNetworkWithNodeMap from '@/lib/beliefNetwork/withNodeMap'

export type NetworkAction<ReturnType = void> = (
	network: Draft<Network>,
	beliefNetwork: BeliefNetworkWithNodeMap
) => ReturnType

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
	for (const node of Object.values(network.nodes))
		beliefNetwork.nodeMap.get(node.id)!.setCpt(cloneDeep(node.cpt))

	return beliefNetwork
}

export const changeName =
	(name: string): NetworkAction =>
	(network, beliefNetwork) => {
		network.name = name
	}

export const addNode =
	({ x, y }: Position): NetworkAction<Node> =>
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

		const beliefNetworkNode = BeliefNetworkNode.withIdUniformDistribution(
			id,
			`Node ${id}`,
			beliefNetwork,
			['Yes', 'No']
		)

		beliefNetwork.nodeMap.set(id, beliefNetworkNode)

		const node: Node = {
			id,
			name: beliefNetworkNode.name,
			parents: [],
			children: [],
			values: cloneDeep(beliefNetworkNode.values),
			cpt: cloneDeep(beliefNetworkNode.cpt),
			...position
		}

		network.nodes[id.toString()] = node

		return node
	}

export const copyNode =
	(node: Node): NetworkAction =>
	(network, beliefNetwork) => {
		const id = getNextNodeId(network)

		beliefNetwork.nodeMap.set(id, beliefNetwork.nodeMap.get(node.id)!.clone(id))

		const newNode = cloneDeep(node)

		newNode.id = id
		newNode.x = node.x + GRID_SPACING_X
		newNode.y = node.y - GRID_SPACING_Y

		network.nodes[id.toString()] = newNode

		for (const parentId of newNode.parents)
			network.nodes[parentId.toString()].children.push(newNode.id)

		for (const childId of newNode.children)
			network.nodes[childId.toString()].parents.push(newNode.id)
	}

export const setNodeName =
	(id: number, name: string): NetworkAction =>
	(network, beliefNetwork) => {
		if (Object.values(network.nodes).some(node => node.name === name))
			throw new Error('Node with this name already exists')

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

		const valueName = name ?? `Value ${node.values.length}`

		beliefNetworkNode.addValue(valueName)
		node.values.push(valueName)

		for (const otherNode of Object.values(network.nodes)) {
			const otherBeliefNetworkNode = beliefNetwork.nodeMap.get(otherNode.id)!
			otherNode.cpt = cloneDeep(otherBeliefNetworkNode.cpt)
		}
	}

export const removeNodeValue =
	(id: number, valueIndex: number): NetworkAction =>
	(network, beliefNetwork) => {
		const node = network.nodes[id.toString()]
		const beliefNetworkNode = beliefNetwork.nodeMap.get(id)!

		beliefNetworkNode.removeValueIndex(valueIndex)

		network.nodes[id.toString()].values.splice(valueIndex, 1)
		node.cpt = cloneDeep(beliefNetworkNode.cpt)
	}

export const setNodeCptValue =
	(
		id: number,
		rowIndex: number,
		valueIndex: number,
		value: number
	): NetworkAction =>
	(network, beliefNetwork) => {
		const node = network.nodes[id.toString()]
		const beliefNetworkNode = beliefNetwork.nodeMap.get(id)!

		beliefNetworkNode.setConditionalProbabilityCell(rowIndex, valueIndex, value)

		if (node.values.length === 2)
			beliefNetworkNode.setConditionalProbabilityCell(
				rowIndex,
				1 - valueIndex,
				util.probComplement(value)
			)

		node.cpt = cloneDeep(beliefNetworkNode.cpt)
	}

export const normalizeNodeCptRow =
	(id: number, rowIndex: number): NetworkAction =>
	(network, beliefNetwork) => {
		const node = network.nodes[id.toString()]
		const beliefNetworkNode = beliefNetwork.nodeMap.get(id)!

		util.normalizeDistribution(beliefNetworkNode.cpt[rowIndex])
		node.cpt = cloneDeep(beliefNetworkNode.cpt)
	}

export const moveNode =
	(id: number, delta: Position): NetworkAction =>
	(network, beliefNetwork) => {
		const node = network.nodes[id.toString()]

		node.x += delta.x
		node.y += delta.y
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

			otherNode.cpt = cloneDeep(otherBeliefNetworkNode.cpt)
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

		child.cpt = cloneDeep(childBeliefNetworkNode.cpt)
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

		child.cpt = cloneDeep(childBeliefNetworkNode.cpt)
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

export const setMonitorShowing =
	(id: number, showing: boolean): NetworkAction =>
	(network, beliefNetwork) => {
		network.nodes[id.toString()].monitor = showing || undefined
	}

export const setEliminationOrderHeuristic =
	(heuristic: EliminationOrderHeuristic): NetworkAction =>
	(network, beliefNetwork) => {
		network.eliminationOrderHeuristic = heuristic
	}
