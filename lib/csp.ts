import {
	getCSP,
	SELF,
	UNSAFE_INLINE,
	UNSAFE_EVAL,
	nonce,
	DATA
} from 'csp-header'

import DEV from './dev'

const csp = (nonceKey: string) =>
	getCSP({
		directives: {
			'base-uri': [SELF],
			'default-src': [SELF],
			'style-src': [SELF, UNSAFE_INLINE],
			'script-src': [SELF, nonce(nonceKey), ...(DEV ? [UNSAFE_EVAL] : [])],
			'font-src': [SELF, DATA, 'at.alicdn.com'],
			'img-src': [SELF, 'authjs.dev']
		}
	})

export default csp
