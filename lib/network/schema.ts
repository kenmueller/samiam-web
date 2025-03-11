import { z } from 'zod'

export const PositionSchema = z.object({
	x: z.number(),
	y: z.number()
})

export const NodeSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		parents: z.array(z.number()),
		children: z.array(z.number()),
		values: z.array(z.string()),
		// Each row in the cpt is an array of probabilities in the same order as the node's 'values'.
		// The row index corresponds to a particular combination of parent states.
		cpt: z.array(z.array(z.number())),
		assertionType: z.enum(['observation', 'intervention']).optional(),
		assertedValue: z.number().optional(),
		monitor: z.literal(true).optional()
	})
	.merge(PositionSchema)

export const EliminationOrderHeuristicSchema = z.enum(['min-fill', 'min-size'])

const NetworkSchema = z.object({
	name: z.string().nullable(),
	eliminationOrderHeuristic: EliminationOrderHeuristicSchema,
	nodes: z.record(NodeSchema)
})

export default NetworkSchema
