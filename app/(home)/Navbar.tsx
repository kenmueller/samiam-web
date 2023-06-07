'use client'

import { useCallback, useEffect } from 'react'

import useNetworkStore from '@/lib/stores/network'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import pick from '@/lib/pick'

const Navbar = () => {
	const { loadNetworkFromStorage, loadNetworkFromFile, saveNetworkToFile } =
		useNetworkStore(
			pick('loadNetworkFromStorage', 'loadNetworkFromFile', 'saveNetworkToFile')
		)

	const openNetwork = useCallback(async () => {
		try {
			await loadNetworkFromFile()
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [loadNetworkFromFile])

	const exportNetwork = useCallback(async () => {
		try {
			await saveNetworkToFile()
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [saveNetworkToFile])

	useEffect(() => {
		loadNetworkFromStorage()
	}, [loadNetworkFromStorage])

	return (
		<nav className="absolute top-4 left-4 right-4 flex items-center gap-4 px-4 py-2 bg-white border-2 rounded-xl z-10">
			<h1>SamIam</h1>
			<div className="flex items-center gap-4 translate-y-[2px]">
				<button className="text-sky-500" onClick={openNetwork}>
					Open
				</button>
				<button className="text-sky-500" onClick={exportNetwork}>
					Export
				</button>
			</div>
		</nav>
	)
}

export default Navbar
