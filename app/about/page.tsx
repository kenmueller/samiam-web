import pageMetadata from '@/lib/metadata/page'

export const generateMetadata = () =>
	pageMetadata({
		title: 'About | SamIam',
		description: 'About SamIam',
		previewTitle: 'About'
	})

const ArchivedNetworks = () => (
	<div className="flex flex-col items-stretch gap-2 px-8 py-6 [&_ol]:list-disc [&_ol]:pl-6 [&_a]:text-sky-500 [&_a]:underline">
		<h1>About</h1>
		<p>
			A Causal Bayesian Network (
			<a href="http://bayes.cs.ucla.edu/BOOK-2K">Causality</a>, §1.3.1) modeling
			and inference software. Created by{' '}
			<a href="https://github.com/kenmueller">Ken Mueller</a>. Inspired entirely
			by <a href="http://reasoning.cs.ucla.edu/samiam/">SamIam</a> and{' '}
			<a href="https://www.cambridge.org/core/books/modeling-and-reasoning-with-bayesian-networks/8A3769B81540EA93B525C4C2700C9DE6">
				Modeling and Reasoning with Bayesian Networks
			</a>{' '}
			by Adnan Darwiche.
		</p>

		<h2>Website</h2>
		<ol>
			<li>
				<a href="https://samiam.ai">https://samiam.ai</a>
			</li>
			<li>
				Source:{' '}
				<a href="https://github.com/kenmueller/samiam-web">
					https://github.com/kenmueller/samiam-web
				</a>
			</li>
		</ol>

		<h2>API Library</h2>
		<ol>
			<li>
				<a href="https://www.npmjs.com/package/samiam">
					https://www.npmjs.com/package/samiam
				</a>
			</li>
			<li>
				Source:{' '}
				<a href="https://github.com/kenmueller/samiam-lib">
					https://github.com/kenmueller/samiam-lib
				</a>
			</li>
		</ol>
	</div>
)

export default ArchivedNetworks
