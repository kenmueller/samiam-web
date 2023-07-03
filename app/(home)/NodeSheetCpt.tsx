'use client'

import { useCallback, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPlus,
	faTrash,
	faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import { toast } from 'react-toastify'
import { areFloatsEqual } from 'samiam/lib/util'

import { Node } from '@/lib/network'
import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import NodeSheetCptValue from './NodeSheetCptValue'
import useSheetStore from '@/lib/stores/sheet'
import NodeSheet from './NodeSheet'
import NodeSheetValue from './NodeSheetValue'
import {
	addNodeValue,
	removeNodeValue,
	normalizeNodeCptRow
} from '@/lib/network/actions'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'
import renderTextWithMath from '@/lib/renderTextWithMath'

import styles from './NodeSheetCpt.module.scss'

const getRowSpan = (
	child: Node,
	parent: Node,
	getNode: (id: number) => Node
) => {
	let rowSpan = 1

	for (const otherParentId of child.parents) {
		if (otherParentId === parent.id) break
		rowSpan *= getNode(otherParentId).values.length
	}

	return rowSpan
}

const NodeSheetCpt = ({ node }: { node: Node }) => {
	const { network, beliefNetwork, applyAction } = useNetworkStore(
		pick('network', 'beliefNetwork', 'applyAction')
	)
	const { setContent } = useSheetStore(pick('setContent'))

	const getNode = useCallback(
		(id: number) => {
			const node = network.nodes[id.toString()]
			if (!node) throw new Error(`Node ${id} not found`)

			return node
		},
		[network]
	)

	const parents = useMemo(
		() =>
			[...node.parents].reverse().map(parentId => {
				const parent = getNode(parentId)
				const rowSpan = getRowSpan(node, parent, getNode)

				return { parent, rowSpan }
			}),
		[getNode, node]
	)

	const exportToLatex = useCallback(async () => {
		try {
			const beliefNetworkNode = beliefNetwork.nodeMap.get(node.id)

			if (!beliefNetworkNode)
				throw new Error('Belief network node does not exist')

			await navigator.clipboard.writeText(beliefNetworkNode.getCptLatex())

			toast.success('Copied LaTeX CPT to clipboard')
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [beliefNetwork, node.id])

	const isCptValid = node.cpt.every(row =>
		areFloatsEqual(
			row.reduce((sum, value) => sum + value, 0),
			1
		)
	)

	return (
		<div className="flex flex-col gap-2 max-w-max">
			<div className="flex justify-between items-center gap-4">
				<div className="flex items-center gap-2">
					<h3>CPT</h3>
					{!isCptValid && (
						<div
							data-balloon-pos="up-left"
							aria-label="One or more distributions do not sum to 1, click Norm to fix"
						>
							<FontAwesomeIcon
								className="text-xl text-raspberry"
								icon={faTriangleExclamation}
							/>
						</div>
					)}
				</div>
				<button
					className="text-uranian-1000 hover:opacity-70 transition-opacity ease-linear"
					onClick={exportToLatex}
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath('Export to $\\LaTeX$')
					}}
				/>
			</div>
			<div className="overflow-x-auto" style={{ transform: 'rotateX(180deg)' }}>
				<table
					className={cx(styles.table, 'table-fixed border-collapse')}
					style={{ transform: 'rotateX(180deg)' }}
					cellPadding={0}
				>
					<thead>
						<tr>
							{parents.map(({ parent }) => (
								<th key={parent.id} className="px-3">
									<button
										className="hover:underline"
										onClick={() => {
											setContent(<NodeSheet id={parent.id} />)
										}}
										dangerouslySetInnerHTML={{
											__html: renderTextWithMath(parent.name)
										}}
									/>
								</th>
							))}
							{node.values.map((_value, valueIndex) => (
								<th key={valueIndex}>
									<NodeSheetValue node={node} valueIndex={valueIndex} />
								</th>
							))}
							<th>
								<button
									className="w-full px-3 text-xl text-charcoal-200"
									onClick={() => {
										applyAction(addNodeValue(node.id))
									}}
								>
									<FontAwesomeIcon icon={faPlus} />
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{node.cpt.map((_row, rowIndex) => {
							const isRowValid = areFloatsEqual(
								node.cpt[rowIndex].reduce((sum, value) => sum + value, 0),
								1
							)

							return (
								<tr key={rowIndex}>
									{parents.map(({ parent, rowSpan }, parentIndex) => {
										const valueIndex =
											(rowIndex / rowSpan) % parent.values.length
										if (!Number.isInteger(valueIndex)) return null

										return (
											<th
												key={parent.id}
												className={cx(
													'px-3',
													parentIndex === parents.length - 1 &&
														'whitespace-nowrap'
												)}
												rowSpan={rowSpan}
											>
												{parent.values[valueIndex]}
											</th>
										)
									})}
									{node.values.map((_value, valueIndex) => (
										<td key={valueIndex}>
											<NodeSheetCptValue
												node={node}
												isValid={isRowValid}
												rowIndex={rowIndex}
												valueIndex={valueIndex}
											/>
										</td>
									))}
									{isRowValid ? (
										<th />
									) : (
										<th className="px-2">
											<button
												className="font-normal text-uranian-1000"
												onClick={() => {
													applyAction(normalizeNodeCptRow(node.id, rowIndex))
												}}
											>
												Norm
											</button>
										</th>
									)}
								</tr>
							)
						})}
						<tr>
							{parents.length ? <th key={0} colSpan={parents.length} /> : ''}
							{/* {parents.map((_parent, parentIndex) => (
								<th key={parentIndex} />
							))} */}
							{node.cpt[0].map((_row, valueIndex) => (
								<th key={valueIndex}>
									<button
										className="w-full text-xl text-raspberry disabled:opacity-50"
										disabled={node.values.length <= 1}
										onClick={() => {
											applyAction(removeNodeValue(node.id, valueIndex))
										}}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</th>
							))}
							<th />
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default NodeSheetCpt
