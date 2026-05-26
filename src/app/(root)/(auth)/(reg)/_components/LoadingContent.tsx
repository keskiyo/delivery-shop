import { RotateCw } from 'lucide-react'

export const LoadingContent = ({
	title,
}: {
	title: string | React.ReactNode
}) => {
	return (
		<div className='flex flex-col items-center justify-center space-y-4'>
			<div className='relative'>
				<RotateCw className='h-10 w-10 text-promo animate-spin' />
				<div className='absolute inset-0 rounded-full border-2 border-promo/20 animate-ping'></div>
			</div>
			<div className='text-center space-y-2'>
				<h3 className='text-xl font-semibold'>{title}</h3>
				<p>Пожалуйста, подождите...</p>
			</div>
		</div>
	)
}
