'use client'

import renderTextWithMath from '@/lib/renderTextWithMath'
import useProbabilityOfEvidence from '@/lib/useProbabilityOfEvidence'

const NodeSheetCptProbabilityOfEvidence = () => {
	const { evidenceString, probabilityOfEvidence } = useProbabilityOfEvidence()

	return (
		<div className="flex flex-col items-stretch gap-2">
			<h3>Probability of Evidence</h3>
			<p
				dangerouslySetInnerHTML={{
					__html: renderTextWithMath(
						`$P($${evidenceString}$) = ${probabilityOfEvidence}$`
					)
				}}
			/>
		</div>
	)
}

export default NodeSheetCptProbabilityOfEvidence
