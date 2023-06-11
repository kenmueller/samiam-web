'use client'

import { CSSProperties, MouseEvent, useCallback, useState } from 'react'

import useNetworkStore from '@/lib/stores/network'
import useOptionStore from '@/lib/stores/option'
import pick from '@/lib/pick'
import NetworkNode from './Node'
import useEvent from '@/lib/useEvent'
import { Position } from '@/lib/network'
import useMouse from '@/lib/useMouse'
import useCanvasStore from '@/lib/stores/canvas'

const Canvas = () => {
	const { network, addNode } = useNetworkStore(pick('network', 'addNode'))
	const { center, setCenter, currentArrowFrom, setCurrentArrowFrom } =
		useCanvasStore(
			pick('center', 'setCenter', 'currentArrowFrom', 'setCurrentArrowFrom')
		)
	const { option } = useOptionStore(pick('option'))

	const mouse = useMouse()
	const [draggingMouse, setDraggingMouse] = useState<Position | null>(null)

	const onMouseDown = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			switch (option) {
				case 'pointer':
					setDraggingMouse({ x: event.clientX, y: event.clientY })
					break
				case 'add-node':
					if (mouse) addNode(mouse)
					break
			}
		},
		[option, addNode, mouse, setDraggingMouse]
	)

	const onMouseMove = useCallback(
		(event: globalThis.MouseEvent) => {
			if (!draggingMouse) return

			setCenter({
				x: center.x + (event.clientX - draggingMouse.x),
				y: center.y - (event.clientY - draggingMouse.y)
			})

			setDraggingMouse({ x: event.clientX, y: event.clientY })
		},
		[center, draggingMouse, setCenter, setDraggingMouse]
	)

	const onMouseUp = useCallback(() => {
		switch (option) {
			case 'pointer':
				setDraggingMouse(null)
				break
			case 'add-edge':
				setCurrentArrowFrom(null)
				break
		}
	}, [option, setDraggingMouse, setCurrentArrowFrom])

	useEvent('body', 'mousemove', onMouseMove)
	useEvent('body', 'mouseup', onMouseUp)

	return (
		<main
			className="absolute inset-0 overflow-hidden z-0"
			onMouseDown={onMouseDown}
		>
			<span
				className="pointer-events-none absolute bg-black bg-opacity-10 left-0 right-0 top-[calc(50%-var(--y))] h-[1px] -translate-y-1/2"
				style={{ '--y': `${center.y}px` } as CSSProperties}
			/>
			<span
				className="pointer-events-none absolute bg-black bg-opacity-10 left-[calc(50%+var(--x))] top-0 bottom-0 w-[1px] -translate-x-1/2"
				style={{ '--x': `${center.x}px` } as CSSProperties}
			/>
			{network.nodes.map(node => (
				<NetworkNode key={node.id} node={node} />
			))}
		</main>
	)
}

export default Canvas
