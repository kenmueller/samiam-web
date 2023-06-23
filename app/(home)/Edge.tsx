'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import { Edge } from '@/lib/network/actions'
import { Node, Position } from '@/lib/network'
import pick from '@/lib/pick'
import useCanvasStore from '@/lib/stores/canvas'
import useOptionStore from '@/lib/stores/option'
import useView from '@/lib/useView'
import useNetworkStore from '@/lib/stores/network'
import { removeEdge } from '@/lib/network/actions'

const padding = 5

export interface EdgeNode {
	from: Node
	to: Node
}

export interface EdgePosition {
	from: Position
	to: Position
}

const NetworkEdge = ({
	arrowId,
	edge,
	position: _position,
	intervened = false
}: {
	arrowId: string
	edge?: EdgeNode
	position?: EdgePosition
	intervened?: boolean
}) => {
	const view = useView()
	const { center, getNodeRef } = useCanvasStore(pick('center', 'getNodeRef'))
	const { option } = useOptionStore(pick('option'))
	const { applyAction } = useNetworkStore(pick('applyAction'))

	const position = _position ?? edge
	if (!position) throw new Error('Edge position not found')

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

	const fromNode = edge && getNodeRef(edge.from?.id)
	const toNode = edge && getNodeRef(edge.to?.id)

	const fromPoint =
		from && fromNode && typeof angle === 'number'
			? {
					x: from.x + (fromNode.offsetWidth / 2) * Math.cos(angle),
					y: from.y + (fromNode.offsetHeight / 2) * Math.sin(angle)
			  }
			: from

	const toPoint =
		to && toNode && typeof angle === 'number'
			? {
					x:
						to.x +
						(toNode.offsetWidth / 2 + padding) * Math.cos(angle + Math.PI),
					y:
						to.y +
						(toNode.offsetHeight / 2 + padding) * Math.sin(angle + Math.PI)
			  }
			: to

	const ref = useRef<SVGLineElement | null>(null)

	const onLineMouseDown = useCallback(() => {
		switch (option) {
			case 'remove':
				if (edge)
					applyAction(removeEdge({ from: edge.from.id, to: edge.to.id }))

				break
		}
	}, [option, edge, applyAction])

	useEffect(() => {
		const line = ref.current
		if (!line) return

		line.addEventListener('mousedown', onLineMouseDown)

		return () => {
			line.removeEventListener('mousedown', onLineMouseDown)
		}
	}, [ref, onLineMouseDown])

	const [, setUpdateKey] = useState<Record<string, never>>({})

	const edgeFrom = edge?.from
	const edgeTo = edge?.to

	useEffect(() => {
		setUpdateKey({})
	}, [edgeFrom, edgeTo, setUpdateKey])

	if (!(fromPoint && toPoint)) return null

	return (
		<>
			<line
				className="transition-opacity ease-linear"
				x1={fromPoint.x}
				y1={fromPoint.y}
				x2={toPoint.x}
				y2={toPoint.y}
				stroke="black"
				strokeWidth={2}
				opacity={intervened ? 0.25 : 1}
				markerEnd={`url(#${arrowId})`}
			/>
			<line
				ref={ref}
				className={cx(option === 'remove' && 'cursor-pointer')}
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
