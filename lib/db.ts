import { createKysely } from '@vercel/postgres-kysely'

export interface UserTable {
	id: string
	photo: string | null
	name: string
	email: string
	created: Date
	updated: Date
}

export interface Database {
	user: UserTable
}

const db = createKysely<Database>()

export default db
