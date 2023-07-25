export default interface User {
	id: string

	image: string | null

	name: string
	email: string
}

export type PublicUser = Omit<User, 'email'>
