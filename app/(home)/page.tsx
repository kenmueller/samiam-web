import { getServerSession } from 'next-auth'

import pageMetadata from '@/lib/metadata/page'
import Navbar from './Navbar'
import Canvas from './Canvas'
import Options from './Options'
import authOptions from '@/lib/auth'

export const generateMetadata = () =>
	pageMetadata({
		title: 'SamIam',
		description: 'SamIam',
		previewTitle: 'SamIam'
	})

const HomePage = async () => {
	const session = await getServerSession(authOptions)

	console.log(session)

	return (
		<div className="relative h-full">
			<Navbar />
			<Canvas />
			<Options />
		</div>
	)
}

export default HomePage
