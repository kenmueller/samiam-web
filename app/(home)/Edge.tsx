'use client'

import { useCallback, useEffect, useRef } from 'react'

import { Edge, Position } from '@/lib/network'
import pick from '@/lib/pick'
import useCanvasStore from '@/lib/stores/canvas'
import useOptionStore from '@/lib/stores/option'
import useView from '@/lib/useView'
import useNetworkStore from '@/lib/stores/network'

const padding = 5

export interface EdgePosition {
	from: Position | undefined
	to: Position | undefined
}

const NetworkEdge = ({
	arrowId,
	edge,
	position
}: {
	arrowId: string
	edge?: Edge
	position: EdgePosition
}) => {
	const view = useView()
	const { center, getNodeRef } = useCanvasStore(pick('center', 'getNodeRef'))
	const { option } = useOptionStore(pick('option'))
	const { removeEdge } = useNetworkStore(pick('removeEdge'))

	const from = view &&
		position.from && {
			x: view.width / 2 + position.from.x + center.x,
			y: view.height / 2 - position.from.y - center.y
		}

	const to = view &&
		position.to && {
			x: view.width / 2 + position.to.x + center.x,
			y: view.height / 2 - position.to.y - center.y
		}

	const angle = from && to && Math.atan2(to.y - from.y, to.x - from.x)

	const fromNode = edge && getNodeRef(edge.from)
	const toNode = edge && getNodeRef(edge.to)

	const fromPoint =
		from && fromNode && typeof angle === 'number'
			? {
					x: from.x + (fromNode.clientWidth / 2) * Math.cos(angle),
					y: from.y + (fromNode.clientHeight / 2) * Math.sin(angle)
			  }
			: from

	const toPoint =
		to && toNode && typeof angle === 'number'
			? {
					x:
						to.x +
						(toNode.clientWidth / 2 + padding) * Math.cos(angle + Math.PI),
					y:
						to.y +
						(toNode.clientHeight / 2 + padding) * Math.sin(angle + Math.PI)
			  }
			: to

	const ref = useRef<SVGLineElement | null>(null)

	const onLineMouseDown = useCallback(() => {
		switch (option) {
			case 'remove':
				if (edge) removeEdge(edge)
				break
		}
	}, [option, edge, removeEdge])

	useEffect(() => {
		const line = ref.current
		if (!line) return

		line.addEventListener('mousedown', onLineMouseDown)

		return () => {
			line.removeEventListener('mousedown', onLineMouseDown)
		}
	}, [ref, onLineMouseDown])

	if (!(fromPoint && toPoint)) return null

	return (
		<>
			<line
				x1={fromPoint.x}
				y1={fromPoint.y}
				x2={toPoint.x}
				y2={toPoint.y}
				stroke="black"
				strokeWidth={2}
				markerEnd={`url(#${arrowId})`}
			/>
			<line
				ref={ref}
				x1={fromPoint.x}
				y1={fromPoint.y}
				x2={toPoint.x}
				y2={toPoint.y}
				stroke="blue"
				strokeWidth={20}
				opacity={0}
			/>
		</>
	)
}

export default NetworkEdge
