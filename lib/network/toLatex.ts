import Network from '.'
import { Edge, GRID_SPACING_X, GRID_SPACING_Y } from './actions'

const networkToLatex = ({ nodes }: Network) => {
	const edges: Edge[] = Object.values(nodes).flatMap(node =>
		node.parents.map(parent => ({ from: parent, to: node.id }))
	)

	return `\\usepackage{tikz}
\\usetikzlibrary{arrows}

\\begin{tikzpicture}[->, >=stealth', every node/.style={draw, ellipse, node distance=1.5cm}]
${Object.values(nodes)
	.map(
		node =>
			`\t\\node at (${[
				Math.round(node.x / GRID_SPACING_X),
				Math.round(node.y / GRID_SPACING_Y)
			].join(', ')}) (${node.id}) {${node.name || `Node ${node.id}`}};`
	)
	.join('\n')}

${edges.map(edge => `\t\\draw (${edge.from}) -- (${edge.to});`).join('\n')}
\\end{tikzpicture}`
}

export default networkToLatex
