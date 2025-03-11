'use client'

import { FormEvent, useCallback, useState } from 'react'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import promptToNetwork from '@/lib/promptToNetwork'
import useNetworkStore from '@/lib/stores/network'
import Network from '@/lib/network'
import saveNetworkToStorage from '@/lib/network/saveToStorage'

const AiChat = () => {
	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [previousNetwork, setPreviousNetwork] = useState<Network | null>(null)
	const { meta, network, setNetwork } = useNetworkStore()

	const handleSubmit = useCallback(
		async (event: FormEvent) => {
			event.preventDefault()

			try {
				setIsLoading(true)
				setPreviousNetwork(network)

				const newNetwork = await promptToNetwork(network, prompt)

				setNetwork(meta, newNetwork)
				saveNetworkToStorage(newNetwork)

				setPrompt('')
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			} finally {
				setIsLoading(false)
			}
		},
		[meta, network, prompt, setNetwork]
	)

	const handleUndo = useCallback(() => {
		if (previousNetwork) {
			setPreviousNetwork(null)

			setNetwork(meta, previousNetwork)
			saveNetworkToStorage(previousNetwork)
		}
	}, [meta, network, previousNetwork, setNetwork])

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<input
				type="text"
				value={prompt}
				onChange={event => setPrompt(event.target.value)}
				placeholder="What do you want to change?"
				className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
				disabled={isLoading}
			/>
			<button
				type="submit"
				className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
				disabled={isLoading}
			>
				{isLoading ? 'Thinking...' : 'Apply AI'}
			</button>
			<button
				type="button"
				onClick={handleUndo}
				disabled={!previousNetwork}
				className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
			>
				Undo AI
			</button>
		</form>
	)
}

export default AiChat
