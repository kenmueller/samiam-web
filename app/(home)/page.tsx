import pageMetadata from '@/lib/metadata/page'
import Navbar from './Navbar'
import Canvas from './Canvas'
import Options from './Options'

export const generateMetadata = () =>
	pageMetadata({
		title: 'SamIam',
		description: 'SamIam',
		previewTitle: 'SamIam'
	})

const HomePage = () => (
	<div className="relative h-full">
		<Navbar />
		<Canvas />
		<Options />
	</div>
)

export default HomePage
