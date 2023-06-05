'use client'

import { useCallback } from 'react'
import cx from 'classnames'
import { FaHandPointUp, FaCircle, FaArrowRight, FaTrash } from 'react-icons/fa'
import { IconType } from 'react-icons'

import useOptionStore, { Option } from '@/lib/stores/option'

const OPTION_ICONS: Record<Option, IconType> = {
	pointer: FaHandPointUp,
	'add-node': FaCircle,
	'add-edge': FaArrowRight,
	remove: FaTrash
}

const Option = ({ option }: { option: Option }) => {
	const { option: currentOption, setOption } = useOptionStore(state => ({
		option: state.option,
		setOption: state.setOption
	}))

	const selected = option === currentOption
	const Icon = OPTION_ICONS[option]

	const updateOption = useCallback(() => {
		setOption(option)
	}, [option, setOption])

	return (
		<button
			className={cx(
				'p-2 rounded-lg',
				selected && 'pointer-events-none bg-sky-500 bg-opacity-50'
			)}
			aria-current={selected || undefined}
			onClick={updateOption}
		>
			<Icon />
		</button>
	)
}

export default Option
