import { getCSP, SELF, UNSAFE_INLINE, UNSAFE_EVAL, nonce } from 'csp-header'

import DEV from './dev'

const csp = (nonceKey: string) =>
	getCSP({
		directives: {
			'base-uri': [SELF],
			'default-src': [SELF],
			'style-src': [SELF, UNSAFE_INLINE],
			'script-src': [SELF, nonce(nonceKey), ...(DEV ? [UNSAFE_EVAL] : [])]
		}
	})

export default csp
