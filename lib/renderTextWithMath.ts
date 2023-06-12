import katex from 'katex'

import 'katex/dist/katex.css'

const katexToString = (math: string, displayMode: boolean) =>
	katex.renderToString(math, {
		throwOnError: false,
		errorColor: '#ef4444',
		displayMode
	})

const renderTextWithMath = (text: string) => {
	text = text.replace(/<([^\s>]+)/g, '&lt;$1')

	text = text.replace(/\\\((.*?)\\\)/gs, (_substring, math: string) =>
		katexToString(math, false)
	)

	return text
}

export default renderTextWithMath
