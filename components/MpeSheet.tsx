'use client'

import { useEffect, useMemo } from 'react'
import cx from 'classnames'
import { useDeepCompareMemo } from 'use-deep-compare'

import pick from '@/lib/pick'
import useNetworkStore from '@/lib/stores/network'
import renderTextWithMath from '@/lib/renderTextWithMath'
import getEvidence, { networkToEvidenceNodes } from '@/lib/network/getEvidence'
import Instantiation from 'samiam/lib/instantiation'
import { AssertionType, Node } from '@/lib/network'
import MpeSheetNode from './MpeSheetNode'

import styles from './MpeSheet.module.scss'
import useSheetStore from '@/lib/stores/sheet'
import MapResult from 'samiam/lib/map-result'

export interface MpeNode {
	node: Node
	hasEvidence: boolean
	instantiation: Instantiation | null
	type: AssertionType | 'mpe'
}

const MpeSheet = () => {
	const { network, beliefNetwork } = useNetworkStore(
		pick('network', 'beliefNetwork')
	)
	const { close } = useSheetStore()

	const nodeCount = Object.keys(network.nodes).length

	useEffect(() => {
		if (!nodeCount) close()
	}, [nodeCount, close])

	const evidenceNodes = useMemo(
		() => networkToEvidenceNodes(network),
		[network]
	)

	const evidence = useDeepCompareMemo(
		() => getEvidence(evidenceNodes, beliefNetwork),
		[evidenceNodes]
	)

	const mpe: MapResult = useMemo(
		() =>
			nodeCount > 0
				? beliefNetwork.mpe(evidence)
				: { condProbability: 1, jointProbability: 1, instantiations: [] },
		[nodeCount, beliefNetwork, evidence]
	)

	const mpeNodes: MpeNode[] = useMemo(
		() =>
			Object.values(network.nodes).map(node => {
				const hasEvidence =
					node.assertionType !== undefined && node.assertedValue !== undefined

				const instantiation = hasEvidence
					? null
					: mpe.instantiations.find(
							instantiation => instantiation.node.id === node.id
					  )!

				const type: MpeNode['type'] = hasEvidence ? node.assertionType! : 'mpe'

				return { node, hasEvidence, instantiation, type }
			}),
		[mpe.instantiations, network.nodes]
	)

	const observationMpeNodes = useMemo(
		() => mpeNodes.filter(mpeNode => mpeNode.type === 'observation'),
		[mpeNodes]
	)

	const interventionMpeNodes = useMemo(
		() => mpeNodes.filter(mpeNode => mpeNode.type === 'intervention'),
		[mpeNodes]
	)

	const mpeMpeNodes = useMemo(
		() => mpeNodes.filter(mpeNode => mpeNode.type === 'mpe'),
		[mpeNodes]
	)

	const renderMpeNodes = (mpeNodes: MpeNode[]) =>
		mpeNodes.map(mpeNode => (
			<MpeSheetNode key={mpeNode.node.id} mpeNode={mpeNode} />
		))

	return (
		<div className="flex flex-col items-stretch gap-4">
			<h3>MPE</h3>
			<div>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{MPE}, \\mathbf{e}_{\\text{obs}}|\\mathbf{e}_{\\text{int}}) = ${mpe.jointProbability}$`
						)
					}}
				/>
				<p
					dangerouslySetInnerHTML={{
						__html: renderTextWithMath(
							`$P(\\text{MPE}|\\mathbf{e}_{\\text{obs}}, \\mathbf{e}_{\\text{int}}) = ${mpe.condProbability}$`
						)
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
							<th className="max-w-[115px]">Node</th>
							<th className="max-w-[115px]">Value</th>
						</tr>
					</thead>
					<tbody>
						{mpeMpeNodes.length > 0 && renderMpeNodes(mpeMpeNodes)}
						{observationMpeNodes.length > 0 && (
							<>
								<tr>
									<td className="text-center underline" colSpan={3}>
										Observed
									</td>
								</tr>
								{renderMpeNodes(observationMpeNodes)}
							</>
						)}
						{interventionMpeNodes.length > 0 && (
							<>
								<tr>
									<td className="text-center underline" colSpan={3}>
										Intervened
									</td>
								</tr>
								{renderMpeNodes(interventionMpeNodes)}
							</>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default MpeSheet
