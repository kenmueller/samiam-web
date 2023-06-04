const Preview = ({ title }: { title: string }) => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			padding: '16px 32px',
			wordWrap: 'break-word',
			wordBreak: 'break-word',
			color: 'white',
			background: '#27272a'
		}}
	>
		<h3
			style={{
				position: 'absolute',
				top: 0,
				left: 16,
				fontSize: 42,
				opacity: 0.5
			}}
		>
			SamIam
		</h3>
		<h1
			style={{
				textAlign: 'center',
				fontSize: 50
			}}
		>
			{title}
		</h1>
	</div>
)

export default Preview
