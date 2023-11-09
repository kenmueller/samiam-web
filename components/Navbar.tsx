'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import cx from 'classnames'
import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
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
import {
	faBars,
	faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import useSheetStore from '@/lib/stores/sheet'
import ProbabilityOfEvidenceSheet from './ProbabilityOfEvidenceSheet'
import MpeSheet from './MpeSheet'
import MapSheet from './MapSheet'
import renderTextWithMath from '@/lib/renderTextWithMath'
import useUserStore from '@/lib/stores/user'
import { changeName } from '@/lib/network/actions'
import MyNetworksSheet from './MyNetworksSheet'
import ORIGIN from '@/lib/origin'

const Navbar = () => {
	const {
		meta,
		network,
		beliefNetwork,
		loadNetworkFromStorage,
		loadNetworkFromFile,
		saveNetworkToFile,
		saveNewNetworkToCloud,
		saveExistingNetworkToCloud,
		getNetworkAsLatex,
		clearNetworkFromStorage,
		applyAction
	} = useNetworkStore(
		pick(
			'meta',
			'network',
			'beliefNetwork',
			'loadNetworkFromStorage',
			'loadNetworkFromFile',
			'saveNewNetworkToCloud',
			'saveExistingNetworkToCloud',
			'saveNetworkToFile',
			'getNetworkAsLatex',
			'clearNetworkFromStorage',
			'applyAction'
		)
	)
	const { setContent: setSheetContent } = useSheetStore(pick('setContent'))
	const { user } = useUserStore(pick('user'))

	const router = useRouter()

	const canQuery = useMemo(
		() =>
			Object.keys(network.nodes).length > 0 &&
			beliefNetwork.invalidNodes.length === 0,
		[network, beliefNetwork]
	)

	const openMyNetworks = useCallback(() => {
		setSheetContent(<MyNetworksSheet />)
	}, [setSheetContent])

	const openNetwork = useCallback(async () => {
		try {
			await loadNetworkFromFile()
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [loadNetworkFromFile])

	const saveNetworkToCloudAndRedirect = useCallback(async () => {
		try {
			if (meta) {
				await saveExistingNetworkToCloud()
				toast.success('Saved new network changes')
			} else {
				const id = await saveNewNetworkToCloud()
				const path = `/networks/${encodeURIComponent(id)}`

				router.push(path)

				await navigator.clipboard.writeText(new URL(path, ORIGIN).href)
				toast.success('Copied new network URL to clipboard')
			}
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [router, meta, saveNewNetworkToCloud, saveExistingNetworkToCloud])

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
			toast.success('Copied LaTeX DAG to clipboard')
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

	const viewProbabilityOfEvidence = useCallback(() => {
		setSheetContent(<ProbabilityOfEvidenceSheet />)
	}, [setSheetContent])

	const viewMpe = useCallback(() => {
		setSheetContent(<MpeSheet />)
	}, [setSheetContent])

	const viewMap = useCallback(() => {
		setSheetContent(<MapSheet />)
	}, [setSheetContent])

	const editName = useCallback(() => {
		const newName = prompt(
			'Enter a new name for the network',
			network.name ?? 'Untitled Network'
		)
		if (!newName) return

		applyAction(changeName(newName))
	}, [applyAction, network.name])

	const hasMeta = !!meta

	useEffect(() => {
		if (!hasMeta) loadNetworkFromStorage()
	}, [hasMeta, loadNetworkFromStorage])

	return (
		<nav className="absolute top-0 left-0 right-0 flex justify-between items-center gap-4 px-6 py-4 z-10 pointer-events-none [&>*]:pointer-events-auto">
			<DropdownMenu>
				<DropdownMenuTrigger className="w-[26px] text-xl">
					<FontAwesomeIcon icon={faBars} />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<button
								className="w-full text-left"
								onClick={async () => {
									await (user ? signOut() : signIn())
								}}
							>
								Sign {user ? 'out' : 'in'}
							</button>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<button
								className={cx('w-full text-left', !user && 'opacity-50')}
								disabled={!user}
								onClick={openMyNetworks}
							>
								My Networks
							</button>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<button className="w-full text-left" onClick={openNetwork}>
								Upload
							</button>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<button
								className={cx('w-full text-left', !user && 'opacity-50')}
								disabled={!user}
								onClick={saveNetworkToCloudAndRedirect}
							>
								{meta && user
									? meta.user === user.id
										? 'Save Changes'
										: 'Save Changes as New Network'
									: 'Save'}
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
											dangerouslySetInnerHTML={{
												__html: renderTextWithMath('$\\LaTeX$ DAG')
											}}
										/>
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
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger
								className={cx(
									'flex items-center gap-1',
									!canQuery && 'text-raspberry'
								)}
								disabled={!canQuery}
							>
								{!canQuery && <FontAwesomeIcon icon={faTriangleExclamation} />}
								<span>Query</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem>
										<button
											className="w-full text-left"
											onClick={viewProbabilityOfEvidence}
											dangerouslySetInnerHTML={{
												__html: renderTextWithMath('$P(\\text{evidence})$')
											}}
										/>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<button className="w-full text-left" onClick={viewMpe}>
											MPE
										</button>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<button className="w-full text-left" onClick={viewMap}>
											MAP
										</button>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<button className="text-xl font-bold text-center" onClick={editName}>
				{network.name ?? 'Untitled Network'}
			</button>
			<span className="w-[26px]" />
		</nav>
	)
}

export default Navbar
