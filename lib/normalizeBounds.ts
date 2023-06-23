import { produce } from 'immer'
import { Bounds } from './network'

const normalizeBounds = (bounds: Bounds) =>
	produce(bounds, bounds => {
		if (bounds.from.x > bounds.to.x) {
			const fromX = bounds.from.x

			bounds.from.x = bounds.to.x
			bounds.to.x = fromX
		}

		if (bounds.from.y > bounds.to.y) {
			const fromY = bounds.from.y

			bounds.from.y = bounds.to.y
			bounds.to.y = fromY
		}
	})

export default normalizeBounds
