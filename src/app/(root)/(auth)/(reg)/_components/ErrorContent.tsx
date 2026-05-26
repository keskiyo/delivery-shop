'use client'

import { RotateCw, XCircle } from 'lucide-react'
import { ReactNode } from 'react'

type ErrorContentProps = {
	error: string | null
	icon?: ReactNode
	title?: string
	primaryAction?: {
		label: string
		onClick: () => void
		className?: string
	}
	secondaryAction?: {
		label: string | React.ReactNode
		onClick: () => void
		className?: string
	}
}

export const ErrorContent = ({
	error,
	icon = <XCircle className='h-8 w-8 text-danger' />,
	title = 'Ошибка отправки',
	primaryAction,
	secondaryAction,
}: ErrorContentProps) => {
	return (
		<div className='space-y-6'>
			<div className='flex flex-col items-center text-center space-y-4'>
				<div className='p-3 bg-danger-soft rounded-full'>{icon}</div>
				<div className='space-y-2'>
					<h3 className='text-2xl font-bold'>{title}</h3>
					{error && <p className='max-w-md'>{error}</p>}
				</div>
			</div>

			<div className='flex flex-col space-y-3'>
				{primaryAction && (
					<button
						onClick={primaryAction.onClick}
						className={`w-full py-3 px-4 bg-danger text-danger-foreground rounded shadow-md hover:shadow-lg duration-300 flex items-center justify-center space-x-2 cursor-pointer ${primaryAction.className}`}
					>
						<span>{primaryAction.label}</span>
					</button>
				)}

				{secondaryAction && (
					<button
						onClick={secondaryAction.onClick}
						className={`w-full py-3 px-4 border bg-surface border-border text-foreground rounded hover:bg-surface-hover duration-300 flex items-center justify-center space-x-2 cursor-pointer ${secondaryAction.className}`}
					>
						<RotateCw size={24} />
						<span>{secondaryAction.label}</span>
					</button>
				)}
			</div>
		</div>
	)
}
