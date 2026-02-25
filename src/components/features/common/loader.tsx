interface LoaderProps {
	text?: string
	className?: string
}

export const Loader = ({ text = '', className = '' }: LoaderProps) => (
	<div
		className={`flex flex-col items-center justify-center gap-3 pt-20 ${className}`}
	>
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 384 384'
			className='loader'
		>
			<circle
				r='176'
				cy='192'
				cx='192'
				strokeWidth='32'
				fill='transparent'
				pathLength='360'
				className='active'
			></circle>
			<circle
				r='176'
				cy='192'
				cx='192'
				strokeWidth='32'
				fill='transparent'
				pathLength='360'
				className='track'
			></circle>
		</svg>
		{text && <p className='text-primary'>Загрузка {text}...</p>}
	</div>
)
