import { Metadata } from 'next'

import favicon from '@/assets/favicon.png'
import ORIGIN from '@/lib/origin'

const baseMetadata: Metadata = {
	metadataBase: ORIGIN,
	applicationName: 'SamIam',
	authors: [{ name: 'Ken Mueller', url: ORIGIN }],
	publisher: 'Ken Mueller',
	creator: 'Ken Mueller',
	themeColor: 'white',
	manifest: '/manifest.webmanifest',
	icons: favicon.src
}

export default baseMetadata
