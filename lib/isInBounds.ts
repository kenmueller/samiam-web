import { Bounds, Position } from './network'

const isInBounds = (position: Position, bounds: Bounds) =>
	position.x >= bounds.from.x &&
	position.x <= bounds.to.x &&
	position.y >= bounds.from.y &&
	position.y <= bounds.to.y

export default isInBounds
