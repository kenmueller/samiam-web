'use client'

import { OPTIONS } from '@/lib/stores/option'
import Option from './Option'

const Options = () => {
	return (
		<footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white border rounded-xl z-10">
			{OPTIONS.map(option => (
				<Option key={option} option={option} />
			))}
		</footer>
	)
}

export default Options
