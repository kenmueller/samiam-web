'use client'

import { useCallback } from 'react'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faHandPointUp,
	faCircle,
	faArrowRight,
	faTrash,
	IconDefinition,
	faHand
} from '@fortawesome/free-solid-svg-icons'

import useOptionStore, { Option } from '@/lib/stores/option'
import pick from '@/lib/pick'
import useEvent from '@/lib/useEvent'

const OPTION_DEFINITIONS: Record<
	Option,
	{ className?: string; icon: IconDefinition; keys: string[] }
> = {
	select: { icon: faHandPointUp, keys: ['1', 'a', 'j'] },
	move: { icon: faHand, keys: ['2', 's', 'k'] },
	'add-node': { icon: faCircle, keys: ['3', 'd', 'l'] },
	'add-edge': { icon: faArrowRight, keys: ['4', 'f', ';'] },
	remove: { className: 'text-raspberry', icon: faTrash, keys: ['5', 'g', "'"] }
}

const Option = ({ option }: { option: Option }) => {
	const { option: currentOption, setOption } = useOptionStore(
		pick('option', 'setOption')
	)

	const selected = option === currentOption
	const { className, icon, keys } = OPTION_DEFINITIONS[option]

	const updateOption = useCallback(() => {
		setOption(option)
	}, [option, setOption])

	const onKeyDown = useCallback(
		(event: globalThis.KeyboardEvent) => {
			if (
				document.activeElement instanceof HTMLInputElement ||
				document.activeElement instanceof HTMLTextAreaElement
			)
				return

			if (!keys.includes(event.key)) return

			event.preventDefault()
			updateOption()
		},
		[keys, updateOption]
	)

	useEvent('window', 'keydown', onKeyDown)

	return (
		<button
			className={cx(
				'relative px-3 py-2 rounded-lg transition-colors ease-linear after:content-[attr(data-key)] after:absolute after:right-[2.5px] after:bottom-[1.5px] after:text-xs',
				selected && 'pointer-events-none bg-uranian bg-opacity-50',
				className
			)}
			aria-current={selected || undefined}
			data-key={keys[0]}
			onClick={updateOption}
		>
			<FontAwesomeIcon icon={icon} />
		</button>
	)
}

export default Option
