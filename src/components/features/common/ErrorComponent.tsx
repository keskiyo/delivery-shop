'use client'


import { ErrorProps } from '@/types/errorProps'

export default function ErrorComponent({ error, userMessage }: ErrorProps) {
	console.error('Произошла ошибка', error)
	return (
		<div className='m-4 p-4 bg-danger-soft text-danger rounded text-center'>
			<p>{userMessage || 'Произошла ошибка попробуйте снова'} </p>
			<button
				onClick={() => window.location.reload()}
				className='mt-2 px-3 py-1 bg-danger rounded cursor-pointer text-white'
			>
				Попробовать снова
			</button>
		</div>
	)
}
