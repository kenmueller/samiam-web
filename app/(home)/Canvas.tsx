'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
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
import useChangeEffect from '@/lib/useNewEffect'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import useSheetStore from '@/lib/stores/sheet'
import NodeSheet from './NodeSheet'

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
		unselectNodes,
		copySelectedNodes,
		pasteCopiedNodes
	} = useCanvasStore(
		pick(
			'center',
			'setCenter',
			'currentArrowFrom',
			'setCurrentArrowFrom',
			'selectNodesInBounds',
			'unselectNodes',
			'copySelectedNodes',
			'pasteCopiedNodes'
		)
	)
	const { option } = useOptionStore(pick('option'))
	const { setContent: setSheetContent } = useSheetStore(pick('setContent'))

	const mouse = useMouse()
	const view = useView()

	const [startMouse, setStartMouse] = useState<Position | null>(null)
	const [currentMouse, setCurrentMouse] = useState<Position | null>(null)

	const onRootMouseDown = useCallback(
		(event: globalThis.MouseEvent) => {
			switch (option) {
				case 'select': {
					const newMouse: Position = { x: event.clientX, y: event.clientY }

					unselectNodes()

					setStartMouse(newMouse)
					setCurrentMouse(newMouse)

					break
				}
				case 'move': {
					const newMouse: Position = { x: event.clientX, y: event.clientY }

					setStartMouse(newMouse)
					setCurrentMouse(newMouse)

					break
				}
				case 'add-node': {
					if (!mouse) break

					const node = applyAction(addNode(mouse))
					setSheetContent(<NodeSheet id={node.id} />)

					break
				}
			}
		},
		[
			option,
			unselectNodes,
			applyAction,
			mouse,
			setCurrentMouse,
			setSheetContent
		]
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

	const onCopy = useCallback(
		async (event: globalThis.ClipboardEvent) => {
			try {
				const result = copySelectedNodes()
				if (!result) return

				event.preventDefault()
				await result
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			}
		},
		[copySelectedNodes]
	)

	useEvent('window', 'copy', onCopy)

	const onPaste = useCallback(
		async (event: globalThis.ClipboardEvent) => {
			try {
				const copiedText = event.clipboardData?.getData('text/plain')
				if (!copiedText) return

				const result = pasteCopiedNodes(copiedText)
				if (!result) return

				event.preventDefault()
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			}
		},
		[pasteCopiedNodes]
	)

	useEvent('window', 'paste', onPaste)

	useChangeEffect(() => {
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
				style={{ top: `calc(50% - ${center.y}px)` }}
			/>
			<span
				className="pointer-events-none absolute bg-black bg-opacity-10 top-0 bottom-0 w-[1px] -translate-x-1/2"
				style={{ left: `calc(50% + ${center.x}px)` }}
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
								edge={{
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
					className="absolute bg-sky-500 bg-opacity-20 border-2 border-sky-500"
					style={{
						left: `${selectionBounds.from.x}px`,
						top: `${selectionBounds.from.y}px`,
						width: `${selectionBounds.to.x - selectionBounds.from.x}px`,
						height: `${selectionBounds.to.y - selectionBounds.from.y}px`
					}}
				/>
			)}
		</main>
	)
}

export default Canvas
