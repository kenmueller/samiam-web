'use client'

import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

import useNetworkStore from '@/lib/stores/network'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import pick from '@/lib/pick'

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
		<nav className="absolute top-4 left-4 right-4 flex items-center gap-4 px-4 py-2 bg-white border-2 rounded-xl z-10">
			<h1>SamIam</h1>
			<div className="flex items-center gap-4 translate-y-[2px]">
				<button
					className="text-sky-500 hover:opacity-70 transition-opacity ease-linear"
					onClick={openNetwork}
				>
					Open
				</button>
				<button
					className="text-sky-500 hover:opacity-70 transition-opacity ease-linear"
					onClick={exportNetworkAsFile}
				>
					Export as File
				</button>
				<button
					className="text-sky-500 hover:opacity-70 transition-opacity ease-linear"
					onClick={exportNetworkAsLatex}
				>
					Export as LaTeX
				</button>
				<button
					className="text-sky-500 hover:opacity-70 transition-opacity ease-linear"
					onClick={clearNetwork}
				>
					Clear
				</button>
			</div>
		</nav>
	)
}

export default Navbar
