import pageMetadata from '@/lib/metadata/page'
import Navbar from './Navbar'
import Main from './Main'
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
		<Main />
		<Options />
	</div>
)

export default HomePage
