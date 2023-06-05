'use client'

import { useCallback, useEffect } from 'react'

import useNetworkStore from '@/lib/stores/network'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'

const Navbar = () => {
	const { loadNetworkFromStorage, loadNetworkFromFile, saveNetworkToFile } =
		useNetworkStore(state => ({
			loadNetworkFromStorage: state.loadNetworkFromStorage,
			loadNetworkFromFile: state.loadNetworkFromFile,
			saveNetworkToFile: state.saveNetworkToFile
		}))

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
		<nav className="flex items-center gap-4">
			<h1>SamIam</h1>
			<button className="text-sky-500" onClick={openNetwork}>
				Open
			</button>
			<button className="text-sky-500" onClick={exportNetwork}>
				Export
			</button>
		</nav>
	)
}

export default Navbar
