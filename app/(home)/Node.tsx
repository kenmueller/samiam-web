'use client'

import { CSSProperties, memo, useCallback, useEffect, useState } from 'react'
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
import renderTextWithMath from '@/lib/renderTextWithMath'
import {
	addEdge,
	removeNode,
	setNodePosition,
	snapNodeToGrid
} from '@/lib/network/actions'

const NetworkNode = ({ node }: { node: Node }) => {
	const { applyAction } = useNetworkStore(pick('applyAction'))
	const {
		center,
		currentArrowFrom,
		setCurrentArrowFrom,
		getNodeRef,
		setNodeRef
	} = useCanvasStore(
		pick(
			'center',
			'currentArrowFrom',
			'setCurrentArrowFrom',
			'getNodeRef',
			'setNodeRef'
		)
	)
	const { option } = useOptionStore(pick('option'))
	const { setContent: setSheetContent } = useSheetStore(pick('setContent'))

	const [startMouse, setStartMouse] = useState<Position | null>(null)
	const [draggingMouse, setDraggingMouse] = useState<Position | null>(null)

	const onMouseMove = useCallback(
		(event: globalThis.MouseEvent) => {
			if (!(startMouse && draggingMouse)) return

			applyAction(
				setNodePosition(node.id, {
					x: node.x + (event.clientX - draggingMouse.x),
					y: node.y - (event.clientY - draggingMouse.y)
				})
			)

			setDraggingMouse({ x: event.clientX, y: event.clientY })
		},
		[
			node.id,
			node.x,
			node.y,
			startMouse,
			draggingMouse,
			applyAction,
			setDraggingMouse
		]
	)

	const onMouseUp = useCallback(() => {
		if (!(startMouse && draggingMouse)) return

		if (startMouse.x === draggingMouse.x && startMouse.y === draggingMouse.y) {
			// Clicked, not dragged
			setSheetContent(<NodeSheet id={node.id} />)
		}

		applyAction(snapNodeToGrid(node.id))

		setStartMouse(null)
		setDraggingMouse(null)
	}, [
		startMouse,
		draggingMouse,
		setSheetContent,
		node.id,
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
			setDraggingMouse
		]
	)

	const onNodeMouseUp = useCallback(
		(event: globalThis.MouseEvent) => {
			switch (option) {
				case 'add-edge':
					if (currentArrowFrom === null) break

					event.stopPropagation()

					try {
						applyAction(addEdge({ from: currentArrowFrom, to: node.id }))
					} catch (unknownError) {
						alertError(errorFromUnknown(unknownError))
					}

					setCurrentArrowFrom(null)

					break
			}
		},
		[option, currentArrowFrom, applyAction, node.id, setCurrentArrowFrom]
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
				'absolute left-[calc(50%+var(--x)+var(--center-x))] top-[calc(50%-var(--y)-var(--center-y))] px-4 py-2 rounded-[100%] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-colors ease-linear',
				(node.assertionType === undefined ||
					node.assertedValue === undefined) &&
					'bg-white border border-gray-500',
				node.assertionType === 'observation' &&
					node.assertedValue !== undefined &&
					'font-bold bg-[#f5d996] border-2 border-yellow-500',
				node.assertionType === 'intervention' &&
					node.assertedValue !== undefined &&
					'font-bold bg-[#99d3f4] border-2 border-sky-500'
			)}
			style={
				{
					'--x': `${node.x}px`,
					'--y': `${node.y}px`,
					'--center-x': `${center.x}px`,
					'--center-y': `${center.y}px`
				} as CSSProperties
			}
		>
			<NodeName
				id={node.id}
				name={node.name}
				extra={
					node.assertionType && node.assertedValue !== undefined
						? ` = ${node.values[node.assertedValue]}`
						: undefined
				}
			/>
		</div>
	)
}

const _NodeName = ({
	id,
	name,
	extra
}: {
	id: number
	name: string
	extra?: string
}) => (
	<p className="whitespace-nowrap">
		<span
			dangerouslySetInnerHTML={{
				__html: name ? renderTextWithMath(name) : `Node ${id}`
			}}
		/>
		{extra && <span>{extra}</span>}
	</p>
)

const NodeName = memo(_NodeName)

export default NetworkNode
