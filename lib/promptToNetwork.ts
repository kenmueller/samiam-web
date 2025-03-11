'use server'

import OpenAI from 'openai'
import NetworkSchema from './network/schema'
import Network, { Node } from './network'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!
})

const functionSpec = {
	name: 'updateNetwork',
	description: `
    Update the Bayesian network JSON based on user instruction, ensuring the output strictly adheres to the provided schema.
  `,
	parameters: {
		type: 'object',
		properties: {
			name: {
				type: ['string', 'null'],
				description: 'The name of the network, can be null.'
			},
			eliminationOrderHeuristic: {
				type: 'string',
				enum: ['min-fill', 'min-size'],
				description: 'Heuristic used for elimination order.'
			},
			nodes: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: {
							type: 'number',
							description: 'The id of the node. Must be unique.'
						},
						name: { type: 'string' },
						x: { type: 'number', description: 'The x coordinate of the node.' },
						y: { type: 'number', description: 'The y coordinate of the node.' },
						parents: {
							type: 'array',
							items: { type: 'number' },
							description: 'Array of parent node IDs (numbers).'
						},
						children: {
							type: 'array',
							items: { type: 'number' },
							description: 'Array of child node IDs (numbers).'
						},
						values: {
							type: 'array',
							items: { type: 'string' },
							description: 'Possible states (strings) for this node.'
						},
						cpt: {
							type: 'array',
							description:
								"A list of rows in the conditional probability table. Each row is an array of probabilities in the same order as 'values'. The row index corresponds to a combination of parent states. The last parent's values vary fastest.",
							items: {
								type: 'array',
								items: { type: 'number' }
							}
						},
						assertionType: {
							type: 'string',
							enum: ['observation', 'intervention'],
							nullable: true,
							description: 'Leave as is, or set to null if creating a node.'
						},
						assertedValue: {
							type: 'number',
							nullable: true,
							description: 'Leave as is, or set to null if creating a node.'
						}
					},
					required: [
						'id',
						'name',
						'x',
						'y',
						'parents',
						'children',
						'values',
						'cpt'
					]
				}
			}
		},
		required: ['name', 'eliminationOrderHeuristic', 'nodes']
	}
} as const

const systemMessage = {
	role: 'system',
	content: `
    You are an expert in Bayesian networks. Each node has:
    - An id (number)
    - parents & children (arrays of node IDs, numbers)
    - values (array of strings for the node's possible states)
    - cpt (a list of rows in the conditional probability table).

    IMPORTANT CPT RULES:
    1. When adding a parent to a node, the CPT must be expanded:
       - The new size should be: (old_size * new_parent_cardinality)
       - Example: If a node with 2 rows adds a parent with 2 values, the new CPT needs 4 rows
       - The old probabilities should be repeated for each new parent value
    2. The total number of CPT rows must ALWAYS equal the product of all parent cardinalities
    3. Each CPT row must contain probabilities that sum to 1.0

    For multiple parents, the last parent's values vary fastest. 
    Example (2 parents: A, B each with [Yes, No]):
      Row 0 -> A=Yes, B=Yes
      Row 1 -> A=Yes, B=No
      Row 2 -> A=No,  B=Yes
      Row 3 -> A=No,  B=No
    Each row is an array of probabilities in the same order as the child's 'values'.

    When positioning nodes:
    - Parent nodes should generally be placed above their children
    - Avoid overlapping nodes by checking existing x, y coordinates

    CRITICAL: You MUST return ALL nodes in the array, even if you only modify some of them.
    If you don't include a node that was in the input, it will be deleted!
  `
} as const

const objectToArrayNodes = (network: Network) => {
	const nodesArray = Object.values(network.nodes)

	return {
		...network,
		nodes: nodesArray
	}
}

const arrayToObjectNodes = (network: ReturnType<typeof objectToArrayNodes>) => {
	const nodesObject: Record<number, Node> = {}

	for (const node of network.nodes) {
		nodesObject[node.id] = node

		if (node.assertionType === null) delete node.assertionType
		if (node.assertedValue === null) delete node.assertedValue
	}

	return {
		...network,
		nodes: nodesObject
	} as Network
}

const promptToNetwork = async (currentNetwork: Network, userPrompt: string) => {
	// Convert nodes from object to array for the API call
	const networkWithArrayNodes = objectToArrayNodes(currentNetwork)

	const userMessage = {
		role: 'user',
		content: `Here is the current network JSON:
\`\`\`json
${JSON.stringify(networkWithArrayNodes, null, 2)}
\`\`\`
User instruction: ${userPrompt}

Please provide the updated network JSON.`
	} as const

	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [systemMessage, userMessage],
		tools: [
			{
				type: 'function',
				function: functionSpec
			}
		],
		tool_choice: {
			type: 'function',
			function: { name: functionSpec.name }
		},
		temperature: 0.2
	})

	console.log(JSON.stringify(response, null, 2))

	const toolCall = response.choices[0]?.message?.tool_calls?.[0]

	if (!toolCall || toolCall.function.name !== functionSpec.name)
		throw new Error('No tool call found in the response.')

	// Parse the response and convert nodes back from array to object
	const parsedResponse = JSON.parse(toolCall.function.arguments)
	const networkWithObjectNodes = arrayToObjectNodes(parsedResponse)

	return NetworkSchema.parse(networkWithObjectNodes) as Network
}

export default promptToNetwork
