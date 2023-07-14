'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'

import { Node, Position } from '@/lib/network'
import pick from '@/lib/pick'
import useCanvasStore from '@/lib/stores/canvas'
import useOptionStore from '@/lib/stores/option'
import useEvent from '@/lib/useEvent'
import useNetworkStore from '@/lib/stores/network'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import useSheetStore from '@/lib/stores/sheet'
import NodeSheet from './NodeSheet'
import {
	addEdge,
	removeNode,
	moveNode,
	snapNodeToGrid
} from '@/lib/network/actions'
import NodeName from './NodeName'
import NodeMonitor from './NodeMonitor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

const NetworkNode = ({ node }: { node: Node }) => {
	const { beliefNetwork, applyAction } = useNetworkStore(
		pick('beliefNetwork', 'applyAction')
	)
	const {
		center,
		currentArrowFrom,
		setCurrentArrowFrom,
		getNodeRef,
		setNodeRef,
		selectedNodes,
		unselectNodes
	} = useCanvasStore(state => ({
		center: state.center,
		currentArrowFrom: state.currentArrowFrom,
		setCurrentArrowFrom: state.setCurrentArrowFrom,
		getNodeRef: state.getNodeRef,
		setNodeRef: state.setNodeRef,
		selectedNodes: state.selectedNodes,
		unselectNodes: state.unselectNodes
	}))
	const { option } = useOptionStore(pick('option'))
	const { setContent: setSheetContent } = useSheetStore(pick('setContent'))

	const [startMouse, setStartMouse] = useState<Position | null>(null)
	const [draggingMouse, setDraggingMouse] = useState<Position | null>(null)

	const isSelected = selectedNodes.includes(node.id)

	const invalidDistributions = useMemo(
		() => beliefNetwork.nodeMap.get(node.id)!.invalidDistributions,

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[node.id, node.cpt, beliefNetwork]
	)

	const onMouseMove = useCallback(
		(event: globalThis.MouseEvent) => {
			if (!(startMouse && draggingMouse)) return

			const delta: Position = {
				x: event.clientX - draggingMouse.x,
				y: -(event.clientY - draggingMouse.y)
			}

			if (selectedNodes.length) {
				for (const id of selectedNodes) applyAction(moveNode(id, delta))
			} else {
				applyAction(moveNode(node.id, delta))
			}

			setDraggingMouse({ x: event.clientX, y: event.clientY })
		},
		[
			node.id,
			startMouse,
			draggingMouse,
			applyAction,
			setDraggingMouse,
			selectedNodes
		]
	)

	const onMouseUp = useCallback(() => {
		if (!(startMouse && draggingMouse)) return

		if (startMouse.x === draggingMouse.x && startMouse.y === draggingMouse.y) {
			// Clicked, not dragged
			setSheetContent(<NodeSheet id={node.id} />)
		}

		if (selectedNodes.length) {
			for (const id of selectedNodes) applyAction(snapNodeToGrid(id))
		} else {
			applyAction(snapNodeToGrid(node.id))
		}

		setStartMouse(null)
		setDraggingMouse(null)
	}, [
		startMouse,
		draggingMouse,
		setSheetContent,
		node.id,
		selectedNodes,
		applyAction,
		setStartMouse,
		setDraggingMouse
	])

	const onNodeMouseDown = useCallback(
		(event: globalThis.MouseEvent) => {
			switch (option) {
				case 'add-edge':
					setCurrentArrowFrom(node.id)
					break
				case 'remove':
					applyAction(removeNode(node.id))
					break
				default:
					event.stopPropagation()

					if (!isSelected) unselectNodes()

					setStartMouse({ x: event.clientX, y: event.clientY })
					setDraggingMouse({ x: event.clientX, y: event.clientY })
			}
		},
		[
			option,
			node.id,
			setCurrentArrowFrom,
			applyAction,
			setStartMouse,
			setDraggingMouse,
			isSelected,
			unselectNodes
		]
	)

	const onNodeMouseUp = useCallback(
		(event: globalThis.MouseEvent) => {
			switch (option) {
				case 'add-edge':
					if (currentArrowFrom === null) break

					event.stopPropagation()

					if (currentArrowFrom === node.id) {
						setSheetContent(<NodeSheet id={node.id} />)
					} else {
						try {
							applyAction(addEdge({ from: currentArrowFrom, to: node.id }))
						} catch (unknownError) {
							alertError(errorFromUnknown(unknownError))
						}
					}

					setCurrentArrowFrom(null)

					break
			}
		},
		[
			option,
			currentArrowFrom,
			applyAction,
			node.id,
			setCurrentArrowFrom,
			setSheetContent
		]
	)

	useEvent('body', 'mousemove', onMouseMove)
	useEvent('body', 'mouseup', onMouseUp)

	const ref = getNodeRef(node.id)

	useEffect(() => {
		if (!ref) return

		ref.addEventListener('mousedown', onNodeMouseDown)

		return () => {
			ref.removeEventListener('mousedown', onNodeMouseDown)
		}
	}, [ref, onNodeMouseDown])

	useEffect(() => {
		if (!ref) return

		ref.addEventListener('mouseup', onNodeMouseUp)

		return () => {
			ref.removeEventListener('mouseup', onNodeMouseUp)
		}
	}, [ref, onNodeMouseUp])

	const onRef = useCallback(
		(ref: HTMLDivElement | null) => {
			setNodeRef(node.id, ref)
		},
		[setNodeRef, node.id]
	)

	return (
		<div
			ref={onRef}
			className={cx(
				'absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-colors ease-linear',
				node.monitor ? 'px-2 py-1.5 rounded-lg' : 'px-4 py-2 rounded-[100%]',
				(node.assertionType === undefined ||
					node.assertedValue === undefined) &&
					'bg-white border bg-opacity-50 border-charcoal-400',
				node.assertionType === 'observation' &&
					node.assertedValue !== undefined &&
					'bg-gold-100 border-2 bg-opacity-50 border-gold-500',
				node.assertionType === 'intervention' &&
					node.assertedValue !== undefined &&
					'bg-uranian border-2 bg-opacity-50 border-uranian-400',
				isSelected &&
					'after:absolute after:inset-[-3px] after:border-2 after:border-dashed after:border-black'
			)}
			style={{
				left: `calc(50% + ${node.x}px + ${center.x}px)`,
				top: `calc(50% - ${node.y}px - ${center.y}px)`
			}}
		>
			<p className="whitespace-nowrap text-center">
				{node.assertionType === 'intervention' &&
					node.assertedValue !== undefined && (
						<>
							<span className="italic">do</span>
							<span>(</span>
						</>
					)}
				<NodeName id={node.id} name={node.name} />
				{node.assertionType !== undefined &&
					node.assertedValue !== undefined && (
						<span> = {node.values[node.assertedValue]}</span>
					)}
				{node.assertionType === 'intervention' &&
					node.assertedValue !== undefined && <span>)</span>}
				{invalidDistributions.length > 0 && (
					<FontAwesomeIcon
						className="ml-1 text-raspberry"
						icon={faTriangleExclamation}
					/>
				)}
			</p>
			{node.monitor && <NodeMonitor node={node} />}
		</div>
	)
}

export default NetworkNode
