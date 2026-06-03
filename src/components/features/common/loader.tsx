interface LoaderProps {
	text?: string
	className?: string
}

const loaderItems = Array.from({ length: 4 }, (_, index) => index)

export const Loader = ({ text = '', className = '' }: LoaderProps) => (
	<div
		className={`flex flex-col items-center justify-center gap-3 pt-20 ${className}`}
		role='status'
		aria-live='polite'
		aria-label={text ? `Загрузка ${text}` : 'Загрузка'}
	>
		<div className='app-loader' aria-hidden='true'>
			{loaderItems.map(item => (
				<div className='app-loader-circle' key={item}>
					<div className='app-loader-dot' />
					<div className='app-loader-outline' />
				</div>
			))}
		</div>
		{text && <p className='text-brand'>Загрузка {text}...</p>}
	</div>
)
