import { useEffect, useRef } from 'react'

import useNewEffect from './useNewEffect'

/** Calls the effect immediately, before render, and on change. */
const useImmediateEffect: typeof useEffect = (effect, deps) => {
	const didMount = useRef(false)

	if (!didMount.current) {
		didMount.current = true
		effect()
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useNewEffect(effect, deps)
}

export default useImmediateEffect
