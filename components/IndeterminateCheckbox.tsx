'use client'

import { HTMLAttributes, useEffect, useRef } from 'react'

export type IndeterminateCheckboxValue =
	| 'checked'
	| 'unchecked'
	| 'indeterminate'

const IndeterminateCheckbox = ({
	value,
	...props
}: {
	value: IndeterminateCheckboxValue
} & Omit<HTMLAttributes<HTMLInputElement>, 'type'>) => {
	const input = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (!input.current) return

		switch (value) {
			case 'checked':
				input.current.checked = true
				input.current.indeterminate = false
				break
			case 'unchecked':
				input.current.checked = false
				input.current.indeterminate = false
				break
			case 'indeterminate':
				input.current.checked = false
				input.current.indeterminate = true
				break
		}
	}, [value, input])

	return <input {...props} ref={input} type="checkbox" />
}

export default IndeterminateCheckbox
