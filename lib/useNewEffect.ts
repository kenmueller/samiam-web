import { useEffect, useRef } from 'react'

/** Calls the effect only on change. */
const useNewEffect: typeof useEffect = (effect, deps) => {
	const didMount = useRef(false)

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true
			return
		}

		return effect()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)
}

export default useNewEffect
