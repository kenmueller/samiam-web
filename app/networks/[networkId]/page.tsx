import pageMetadata from '@/lib/metadata/page'
import Navbar from '@/components/Navbar'
import Canvas from '@/components/Canvas'
import Options from '@/components/Options'

export const generateMetadata = () =>
	pageMetadata({
		title: 'SamIam',
		description: 'SamIam',
		previewTitle: 'SamIam'
	})

const NetworkPage = () => {
	;<div className="relative h-full">
		<Navbar />
		<Canvas />
		<Options />
	</div>
}

export default NetworkPage
