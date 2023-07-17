import User from '.'

/** User data sent along with the token. */
type UserTokenData = Pick<User, 'id' | 'photo' | 'name' | 'email'>

export default UserTokenData
