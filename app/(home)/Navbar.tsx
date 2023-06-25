'use client'

import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import useNetworkStore from '@/lib/stores/network'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import pick from '@/lib/pick'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
	const {
		loadNetworkFromStorage,
		loadNetworkFromFile,
		saveNetworkToFile,
		getNetworkAsLatex,
		clearNetworkFromStorage
	} = useNetworkStore(
		pick(
			'loadNetworkFromStorage',
			'loadNetworkFromFile',
			'saveNetworkToFile',
			'getNetworkAsLatex',
			'clearNetworkFromStorage'
		)
	)

	const openNetwork = useCallback(async () => {
		try {
			await loadNetworkFromFile()
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [loadNetworkFromFile])

	const exportNetworkAsFile = useCallback(async () => {
		try {
			await saveNetworkToFile()
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [saveNetworkToFile])

	const exportNetworkAsLatex = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(getNetworkAsLatex())
			toast.success('LaTeX code copied to clipboard')
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [getNetworkAsLatex])

	const clearNetwork = useCallback(() => {
		try {
			if (!confirm('Are you sure you want to clear the network?')) return
			clearNetworkFromStorage()
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [clearNetworkFromStorage])

	useEffect(() => {
		loadNetworkFromStorage()
	}, [loadNetworkFromStorage])

	return (
		<nav className="absolute top-0 left-0 right-0 flex items-center gap-4 px-6 py-4 z-10 pointer-events-none [&>*]:pointer-events-auto">
			<DropdownMenu>
				<DropdownMenuTrigger className="text-xl">
					<FontAwesomeIcon icon={faBars} />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<button className="w-full text-left" onClick={openNetwork}>
								Open
							</button>
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem>
										<button
											className="w-full text-left"
											onClick={exportNetworkAsFile}
										>
											JSON
										</button>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<button
											className="w-full text-left"
											onClick={exportNetworkAsLatex}
										>
											LaTeX DAG
										</button>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuItem>
							<button className="w-full text-left" onClick={clearNetwork}>
								Clear
							</button>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	)
}

export default Navbar
