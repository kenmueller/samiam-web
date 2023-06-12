'use client'

import { CSSTransition } from 'react-transition-group'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faXmark,
	faUpRightAndDownLeftFromCenter,
	faDownLeftAndUpRightToCenter
} from '@fortawesome/free-solid-svg-icons'

import useSheetStore from '@/lib/stores/sheet'
import pick from '@/lib/pick'

import styles from './Sheet.module.scss'

const Sheet = () => {
	const { isOpen } = useSheetStore(pick('isOpen'))

	return (
		<CSSTransition
			in={isOpen}
			timeout={200}
			classNames={{
				enter: styles.enter,
				enterActive: styles.enterActive,
				exit: styles.exit,
				exitActive: styles.exitActive
			}}
			mountOnEnter
			unmountOnExit
		>
			<SheetInner />
		</CSSTransition>
	)
}

const SheetInner = () => {
	const { close, content, isFullScreen, toggleFullScreen } = useSheetStore(
		pick('close', 'content', 'isFullScreen', 'toggleFullScreen')
	)

	return createPortal(
		<div className="fixed top-0 right-0 bottom-0 w-60 bg-white z-10">
			<div className="flex justify-end items-center gap-4">
				<button onClick={toggleFullScreen}>
					<FontAwesomeIcon
						icon={
							isFullScreen
								? faDownLeftAndUpRightToCenter
								: faUpRightAndDownLeftFromCenter
						}
					/>
				</button>
				<button onClick={close}>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</div>
			{content}
		</div>,
		document.body
	)
}

export default Sheet
