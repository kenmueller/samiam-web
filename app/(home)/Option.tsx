'use client'

import { useCallback } from 'react'
import cx from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faHandPointUp,
	faCircle,
	faArrowRight,
	faTrash,
	IconDefinition
} from '@fortawesome/free-solid-svg-icons'

import useOptionStore, { Option } from '@/lib/stores/option'
import pick from '@/lib/pick'

const OPTION_ICONS: Record<Option, IconDefinition> = {
	pointer: faHandPointUp,
	'add-node': faCircle,
	'add-edge': faArrowRight,
	remove: faTrash
}

const Option = ({ option }: { option: Option }) => {
	const { option: currentOption, setOption } = useOptionStore(
		pick('option', 'setOption')
	)

	const selected = option === currentOption

	const updateOption = useCallback(() => {
		setOption(option)
	}, [option, setOption])

	return (
		<button
			className={cx(
				'px-3 py-2 rounded-lg',
				selected && 'pointer-events-none bg-sky-500 bg-opacity-50'
			)}
			aria-current={selected || undefined}
			onClick={updateOption}
		>
			<FontAwesomeIcon icon={OPTION_ICONS[option]} />
		</button>
	)
}

export default Option
