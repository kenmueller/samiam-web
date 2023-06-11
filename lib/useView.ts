import { useCallback, useEffect, useState } from 'react'

export interface Bounds {
	width: number
	height: number
}

const useView = () => {
	const [view, setView] = useState<Bounds | null>(null)

	const onResize = useCallback(() => {
		setView({
			width: window.innerWidth,
			height: window.innerHeight
		})
	}, [setView])

	useEffect(() => {
		onResize()
		window.addEventListener('resize', onResize)

		return () => {
			window.removeEventListener('resize', onResize)
		}
	}, [onResize])

	return view
}

export default useView
