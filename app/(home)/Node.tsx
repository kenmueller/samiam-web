'use client'

import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'

import { Node, Position } from '@/lib/network'
import pick from '@/lib/pick'
import useCanvasStore from '@/lib/stores/canvas'
import useOptionStore from '@/lib/stores/option'
import useEvent from '@/lib/useEvent'
import useNetworkStore from '@/lib/stores/network'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'

const NetworkNode = ({ node }: { node: Node }) => {
	const { setNodePosition, snapNodeToGrid, removeNode, addEdge } =
		useNetworkStore(
			pick('setNodePosition', 'snapNodeToGrid', 'removeNode', 'addEdge')
		)
	const { center, currentArrowFrom, setCurrentArrowFrom } = useCanvasStore(
		pick('center', 'currentArrowFrom', 'setCurrentArrowFrom')
	)
	const { option } = useOptionStore(pick('option'))

	const [draggingMouse, setDraggingMouse] = useState<Position | null>(null)

	const onMouseMove = useCallback(
		(event: globalThis.MouseEvent) => {
			if (!draggingMouse) return

			setNodePosition(node.id, {
				x: node.x + (event.clientX - draggingMouse.x),
				y: node.y - (event.clientY - draggingMouse.y)
			})

			setDraggingMouse({ x: event.clientX, y: event.clientY })
		},
		[node.id, node.x, node.y, draggingMouse, setNodePosition, setDraggingMouse]
	)

	const onMouseUp = useCallback(() => {
		if (!draggingMouse) return

		snapNodeToGrid(node.id)
		setDraggingMouse(null)
	}, [draggingMouse, node.id, snapNodeToGrid, setDraggingMouse])

	const onNodeMouseDown = useCallback(
		(event: globalThis.MouseEvent) => {
			switch (option) {
				case 'add-edge':
					setCurrentArrowFrom(node.id)
					break
				case 'remove':
					removeNode(node.id)
					break
				default:
					event.stopPropagation()
					setDraggingMouse({ x: event.clientX, y: event.clientY })
			}
		},
		[option, node.id, setCurrentArrowFrom, removeNode, setDraggingMouse]
	)

	const onNodeMouseUp = useCallback(
		(event: globalThis.MouseEvent) => {
			switch (option) {
				case 'add-edge':
					if (currentArrowFrom === null) break

					event.stopPropagation()

					try {
						addEdge({ from: currentArrowFrom, to: node.id })
					} catch (unknownError) {
						alertError(errorFromUnknown(unknownError))
					}

					setCurrentArrowFrom(null)

					break
			}
		},
		[option, currentArrowFrom, addEdge, node.id, setCurrentArrowFrom]
	)

	useEvent('body', 'mousemove', onMouseMove)
	useEvent('body', 'mouseup', onMouseUp)

	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const node = ref.current
		if (!node) return

		node.addEventListener('mousedown', onNodeMouseDown)

		return () => {
			node.removeEventListener('mousedown', onNodeMouseDown)
		}
	}, [ref, onNodeMouseDown])

	useEffect(() => {
		const node = ref.current
		if (!node) return

		node.addEventListener('mouseup', onNodeMouseUp)

		return () => {
			node.removeEventListener('mouseup', onNodeMouseUp)
		}
	}, [ref, onNodeMouseUp])

	return (
		<div
			ref={ref}
			className="absolute left-[calc(50%+var(--x)+var(--center-x))] top-[calc(50%-var(--y)-var(--center-y))] px-4 py-2 bg-sky-500 rounded-[100%] -translate-x-1/2 -translate-y-1/2"
			style={
				{
					'--x': `${node.x}px`,
					'--y': `${node.y}px`,
					'--center-x': `${center.x}px`,
					'--center-y': `${center.y}px`
				} as CSSProperties
			}
		>
			<p className="whitespace-nowrap">{node.name}</p>
		</div>
	)
}

export default NetworkNode
