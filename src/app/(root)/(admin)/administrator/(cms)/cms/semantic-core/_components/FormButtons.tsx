import { FormButtonsProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types/siteSettings'
import Link from 'next/link'

export const FormButtons = ({ saving, disabled = false }: FormButtonsProps) => {
	return (
		<div className='flex gap-3 pt-4 border-t'>
			<button
				type='submit'
				disabled={saving || disabled}
				className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-600/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer duration-300'
			>
				{saving ? 'Сохранение...' : 'Сохранить настройки'}
			</button>
			<Link
				href='/administrator/cms'
				className='px-4 py-2 border rounded hover:bg-gray-50 hover:text-gray-800 cursor-pointer duration-300'
			>
				Назад к панели инструментов
			</Link>
		</div>
	)
}
