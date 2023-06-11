'use client'

import { useCallback, useEffect, useRef } from 'react'

import { Edge, Position } from '@/lib/network'
import pick from '@/lib/pick'
import useCanvasStore from '@/lib/stores/canvas'
import useOptionStore from '@/lib/stores/option'
import useView from '@/lib/useView'
import useNetworkStore from '@/lib/stores/network'

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
	const { center } = useCanvasStore(pick('center'))
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

	if (!(from && to)) return null

	return (
		<>
			<line
				x1={from.x}
				y1={from.y}
				x2={to.x}
				y2={to.y}
				stroke="black"
				strokeWidth={2}
				markerEnd={`url(#${arrowId})`}
			/>
			<line
				ref={ref}
				x1={from.x}
				y1={from.y}
				x2={to.x}
				y2={to.y}
				stroke="blue"
				strokeWidth={20}
				opacity={0}
			/>
		</>
	)
}

export default NetworkEdge
