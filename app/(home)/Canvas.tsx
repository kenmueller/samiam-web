'use client'

import {
	CSSProperties,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState
} from 'react'
import cx from 'classnames'

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
import { addNode } from '@/lib/network/actions'
import normalizeBounds from '@/lib/normalizeBounds'

const Canvas = () => {
	const arrowId = useId()

	const { network, applyAction } = useNetworkStore(
		pick('network', 'applyAction')
	)
	const {
		center,
		setCenter,
		currentArrowFrom,
		setCurrentArrowFrom,
		selectNodesInBounds,
		unselectNodes
	} = useCanvasStore(
		pick(
			'center',
			'setCenter',
			'currentArrowFrom',
			'setCurrentArrowFrom',
			'selectNodesInBounds',
			'unselectNodes'
		)
	)
	const { option } = useOptionStore(pick('option'))

	const mouse = useMouse()
	const view = useView()

	const [startMouse, setStartMouse] = useState<Position | null>(null)
	const [currentMouse, setCurrentMouse] = useState<Position | null>(null)

	const onRootMouseDown = useCallback(
		(event: globalThis.MouseEvent) => {
			switch (option) {
				case 'select':
				case 'move': {
					const newMouse: Position = { x: event.clientX, y: event.clientY }

					setStartMouse(newMouse)
					setCurrentMouse(newMouse)

					break
				}
				case 'add-node':
					if (mouse) applyAction(addNode(mouse))
					break
			}
		},
		[option, applyAction, mouse, setCurrentMouse]
	)

	const onMouseMove = useCallback(
		(event: globalThis.MouseEvent) => {
			if (!(startMouse && currentMouse)) return

			const newMouse: Position = { x: event.clientX, y: event.clientY }

			switch (option) {
				case 'select':
					selectNodesInBounds(
						normalizeBounds({
							from: {
								x: startMouse.x - window.innerWidth / 2 - center.x,
								y: -startMouse.y + window.innerHeight / 2 - center.y
							},
							to: {
								x: newMouse.x - window.innerWidth / 2 - center.x,
								y: -newMouse.y + window.innerHeight / 2 - center.y
							}
						})
					)
					break
				case 'move':
					setCenter({
						x: center.x + (newMouse.x - currentMouse.x),
						y: center.y - (newMouse.y - currentMouse.y)
					})
					break
			}

			setCurrentMouse(newMouse)
		},
		[
			option,
			center,
			startMouse,
			currentMouse,
			selectNodesInBounds,
			setCenter,
			setCurrentMouse
		]
	)

	const onMouseUp = useCallback(() => {
		switch (option) {
			case 'select':
			case 'move':
				setStartMouse(null)
				setCurrentMouse(null)
				break

			case 'add-edge':
				setCurrentArrowFrom(null)
				break
		}
	}, [option, setCurrentMouse, setCurrentArrowFrom])

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

	useEffect(() => {
		unselectNodes()
	}, [option, unselectNodes])

	const selectionBounds = useMemo(
		() =>
			startMouse &&
			currentMouse &&
			normalizeBounds({ from: startMouse, to: currentMouse }),
		[startMouse, currentMouse]
	)

	return (
		<main
			ref={ref}
			className={cx(
				'absolute inset-0 overflow-hidden z-0',
				option === 'move' && 'cursor-grab'
			)}
		>
			<span
				className="pointer-events-none absolute bg-black bg-opacity-10 left-0 right-0 top-[calc(50%-var(--y))] h-[1px] -translate-y-1/2"
				style={{ '--y': `${center.y}px` } as CSSProperties}
			/>
			<span
				className="pointer-events-none absolute bg-black bg-opacity-10 left-[calc(50%+var(--x))] top-0 bottom-0 w-[1px] -translate-x-1/2"
				style={{ '--x': `${center.x}px` } as CSSProperties}
			/>
			{Object.values(network.nodes).map(node => (
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
					{Object.values(network.nodes).map(childNode =>
						childNode.parents.map(parentId => (
							<NetworkEdge
								key={`${parentId}-${childNode.id}`}
								arrowId={arrowId}
								edge={{ from: parentId, to: childNode.id }}
								position={{
									from: network.nodes[parentId.toString()],
									to: childNode
								}}
								intervened={
									childNode.assertionType === 'intervention' &&
									childNode.assertedValue !== undefined
								}
							/>
						))
					)}
					{!(currentArrowFrom === null || mouse === null) && (
						<NetworkEdge
							arrowId={arrowId}
							position={{
								from: network.nodes[currentArrowFrom.toString()],
								to: mouse
							}}
						/>
					)}
				</svg>
			)}
			{option === 'select' && selectionBounds && (
				<span
					className="absolute left-[var(--from-x)] top-[var(--from-y)] w-[calc(var(--to-x)-var(--from-x))] h-[calc(var(--to-y)-var(--from-y))] bg-sky-500 bg-opacity-20 border-2 border-sky-500"
					style={
						{
							'--from-x': `${selectionBounds.from.x}px`,
							'--from-y': `${selectionBounds.from.y}px`,
							'--to-x': `${selectionBounds.to.x}px`,
							'--to-y': `${selectionBounds.to.y}px`
						} as CSSProperties
					}
				/>
			)}
		</main>
	)
}

export default Canvas
