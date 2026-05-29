import { FormButtonsProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types/site-settings'
import Link from 'next/link'

export const FormButtons = ({ saving, disabled = false }: FormButtonsProps) => {
	return (
		<div className='flex gap-3 pt-4 border-t border-border'>
			<button
				type='submit'
				disabled={saving || disabled}
				className='px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer duration-300'
			>
				{saving ? 'Сохранение...' : 'Сохранить настройки'}
			</button>
			<Link
				href='/administrator/cms'
				className='px-4 py-2 border border-border rounded hover:bg-surface-hover hover:text-foreground cursor-pointer duration-300'
			>
				Назад к панели инструментов
			</Link>
		</div>
	)
}
