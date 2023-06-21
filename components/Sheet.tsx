'use client'

import { CSSTransition } from 'react-transition-group'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faXmark,
	faUpRightAndDownLeftFromCenter,
	faDownLeftAndUpRightToCenter
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

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
		<div className="fixed inset-0 z-10 pointer-events-none">
			<div
				className={cx(
					'absolute top-0 right-0 bottom-0 bg-white transition-all duration-200 pointer-events-auto shadow-xl select-text touch-auto grid grid-rows-[auto_1fr]',
					isFullScreen ? 'left-0' : 'left-[calc(clamp(0,50%+100px,100%-800px))]'
				)}
			>
				<div className="flex justify-end items-center">
					<button className="text-lg px-2" onClick={toggleFullScreen}>
						<FontAwesomeIcon
							icon={
								isFullScreen
									? faDownLeftAndUpRightToCenter
									: faUpRightAndDownLeftFromCenter
							}
						/>
					</button>
					<button className="text-2xl px-2" onClick={close}>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</div>
				<div className="overflow-y-auto p-2">{content}</div>
			</div>
		</div>,
		document.body
	)
}

export default Sheet
