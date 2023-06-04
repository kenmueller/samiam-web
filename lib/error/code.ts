enum ErrorCode {
	PermanentRedirect = 301,
	TemporaryRedirect = 307,
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	Internal = 500,
	Socket = 1003
}

export default ErrorCode
