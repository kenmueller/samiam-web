import { useEffect } from 'react'

const useEvent = <
	Source extends 'window' | 'body',
	EventMap extends Source extends 'window'
		? WindowEventMap
		: Source extends 'body'
		? HTMLElementEventMap
		: never,
	Type extends keyof EventMap
>(
	source: Source,
	type: Type,
	handler: (event: EventMap[Type]) => void
) => {
	useEffect(() => {
		const _source = source === 'window' ? window : document.body

		_source.addEventListener(
			type as string,
			handler as (event: unknown) => void
		)

		return () => {
			_source.removeEventListener(
				type as string,
				handler as (event: unknown) => void
			)
		}
	}, [source, type, handler])
}

export default useEvent
