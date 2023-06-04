import pageMetadata from '@/lib/metadata/page'

export const generateMetadata = () =>
	pageMetadata({
		title: 'SamIam',
		description: 'SamIam',
		previewTitle: 'SamIam'
	})

const HomePage = () => (
	<main className="flex flex-col h-full">
		<h1 className="m-auto text-5xl font-black">SamIam</h1>
	</main>
)

export default HomePage
