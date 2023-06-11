import { useCallback, useState } from 'react'
import useEvent from './useEvent'
import useCanvasStore from './stores/canvas'
import pick from './pick'
import { Position } from './network'
import useView from './useView'

const useMouse = () => {
	const { center } = useCanvasStore(pick('center'))
	const view = useView()
	const [mouse, setMouse] = useState<Position | null>(null)

	const onMouseMove = useCallback(
		(event: globalThis.MouseEvent) => {
			if (!view) return

			setMouse({
				x: event.clientX - view.width / 2 - center.x,
				y: -event.clientY + view.height / 2 - center.y
			})
		},
		[view, center, setMouse]
	)

	useEvent('body', 'mousemove', onMouseMove)

	return mouse
}

export default useMouse
