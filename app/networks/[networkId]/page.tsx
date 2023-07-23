import { notFound } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import Navbar from '@/components/Navbar'
import Canvas from '@/components/Canvas'
import Options from '@/components/Options'
import SetNetworkPageState from './SetState'
import getNetwork from '@/lib/network/get'

export const generateMetadata = () =>
	pageMetadata({
		title: 'SamIam',
		description: 'SamIam',
		previewTitle: 'SamIam'
	})

const NetworkPage = async ({
	params: { networkId }
}: {
	params: { networkId: string }
}) => {
	const network = await getNetwork(networkId)
	if (!network) notFound()

	return (
		<div className="relative h-full">
			<SetNetworkPageState network={network} />
			<Navbar />
			<Canvas />
			<Options />
		</div>
	)
}

export default NetworkPage
