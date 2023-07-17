export default interface User {
	id: string

	/** Photo URL. */
	photo: string | null

	name: string
	email: string

	points: number

	/** Milliseconds since epoch. */
	created: number

	/** Milliseconds since epoch. */
	updated: number
}
