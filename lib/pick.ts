import _pick from 'lodash/pick'

const pick =
	<T extends object, U extends keyof T>(...keys: U[]) =>
	(object: T) =>
		_pick(object, ...keys)

export default pick
