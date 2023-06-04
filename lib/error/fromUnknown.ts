import HttpError from './http'
import DEFAULT_ERROR_MESSAGE from './defaultMessage'
import ErrorCode from './code'

const errorFromUnknown = (value: unknown) =>
	value instanceof HttpError
		? value
		: new HttpError(
				ErrorCode.Internal,
				value instanceof Error ? value.message : DEFAULT_ERROR_MESSAGE
		  )

export default errorFromUnknown
