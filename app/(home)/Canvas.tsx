'use client'

import {
	CSSProperties,
	MouseEvent,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState
} from 'react'

import useNetworkStore from '@/lib/stores/network'
import useOptionStore from '@/lib/stores/option'
import pick from '@/lib/pick'
import NetworkNode from './Node'
import useEvent from '@/lib/useEvent'
import { Position } from '@/lib/network'
import useMouse from '@/lib/useMouse'
import useCanvasStore from '@/lib/stores/canvas'
import useView from '@/lib/useView'
import NetworkEdge from './Edge'

const Canvas = () => {
	const arrowId = useId()

	const { network, addNode } = useNetworkStore(pick('network', 'addNode'))
	const { center, setCenter, currentArrowFrom, setCurrentArrowFrom } =
		useCanvasStore(
			pick('center', 'setCenter', 'currentArrowFrom', 'setCurrentArrowFrom')
		)
	const { option } = useOptionStore(pick('option'))

	const mouse = useMouse()
	const view = useView()

	const [draggingMouse, setDraggingMouse] = useState<Position | null>(null)

	const onRootMouseDown = useCallback(
		(event: globalThis.MouseEvent) => {
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

	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const root = ref.current
		if (!root) return

		root.addEventListener('mousedown', onRootMouseDown)

		return () => {
			root.removeEventListener('mousedown', onRootMouseDown)
		}
	}, [ref, onRootMouseDown])

	return (
		<main ref={ref} className="absolute inset-0 overflow-hidden z-0">
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
			{view && (
				<svg viewBox={`0 0 ${view.width} ${view.height}`}>
					<defs>
						<marker
							id={arrowId}
							viewBox="0 0 10 10"
							refX={5}
							refY={5}
							markerWidth={6}
							markerHeight={6}
							orient="auto-start-reverse"
						>
							<path d="M 0 0 L 10 5 L 0 10 z" />
						</marker>
					</defs>
					{network.edges.map(edge => (
						<NetworkEdge
							key={`${edge.from}-${edge.to}`}
							arrowId={arrowId}
							edge={edge}
							position={{
								from: network.nodes.find(node => node.id === edge.from),
								to: network.nodes.find(node => node.id === edge.to)
							}}
						/>
					))}
					{!(currentArrowFrom === null || mouse === null) && (
						<NetworkEdge
							arrowId={arrowId}
							position={{
								from: network.nodes.find(node => node.id === currentArrowFrom),
								to: mouse
							}}
						/>
					)}
				</svg>
			)}
		</main>
	)
}

export default Canvas
