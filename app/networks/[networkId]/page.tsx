import { notFound } from 'next/navigation'

import pageMetadata from '@/lib/metadata/page'
import Navbar from '@/components/Navbar'
import Canvas from '@/components/Canvas'
import Options from '@/components/Options'
import SetNetworkPageState from './SetState'
import getNetwork from '@/lib/network/get'
import getPublicUser from '@/lib/user/getPublic'

export const generateMetadata = async ({
	params: { networkId }
}: {
	params: { networkId: string }
}) => {
	const networkWithMeta = await getNetwork(networkId)
	if (!networkWithMeta) return {}

	const { meta, network } = networkWithMeta

	const user = await getPublicUser(meta.user)
	if (!user) return {}

	return pageMetadata({
		title: `${meta.name ?? 'Untitled Network'} | SamIam`,
		description: `View ${network.name ?? 'Untitled Network'} network by ${
			user.name
		} on SamIam`,
		previewTitle: meta.name ?? 'Untitled Network'
	})
}

const NetworkPage = async ({
	params: { networkId }
}: {
	params: { networkId: string }
}) => {
	const networkWithMeta = await getNetwork(networkId)
	if (!networkWithMeta) notFound()

	const { network } = networkWithMeta

	return (
		<div className="relative h-full">
			<SetNetworkPageState network={network} />
			<Navbar isNetworkFromCloud />
			<Canvas />
			<Options />
		</div>
	)
}

export default NetworkPage
