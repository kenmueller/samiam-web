import { useCallback, useState } from 'react'
import useEvent from './useEvent'
import useCanvasStore from './stores/canvas'
import pick from './pick'
import { Position } from './network'

const useMouse = () => {
	const { center } = useCanvasStore(pick('center'))
	const [mouse, setMouse] = useState<Position | null>(null)

	const onMouseMove = useCallback(
		(event: globalThis.MouseEvent) => {
			setMouse({
				x: event.clientX - window.innerWidth / 2 - center.x,
				y: -event.clientY + window.innerHeight / 2 - center.y
			})
		},
		[center, setMouse]
	)

	useEvent('body', 'mousemove', onMouseMove)

	return mouse
}

export default useMouse
