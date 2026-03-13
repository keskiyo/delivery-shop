import CloseButton from '@/app/(root)/(auth)/_components/CloseButton'

export const AuthFormLayout = ({
	children,
	variant = 'default',
}: {
	children: React.ReactNode
	variant?: 'register' | 'default'
}) => (
	<div className='fixed inset-0 z-100 flex items-center bg-black/50 justify-center min-h-screen py-10 px-3 backdrop-blur-sm'>
		<div
			className={` ${variant === 'register' ? 'max-w-171.75' : 'max-w-105'} relative bg-card rounded w-full max-h-[calc(100vh-80px)] flex flex-col`}
		>
			<CloseButton />
			<div className='pt-18 pb-10 overflow-y-auto flex-1'>{children}</div>
		</div>
	</div>
)
