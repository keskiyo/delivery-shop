import { Search } from 'lucide-react'
import { SidebarSearchInputProps } from '../types/sidebar.types'

export default function SearchInput({
  value,
  onChange,
}: SidebarSearchInputProps) {
	return (
		<div className='relative'>
			<Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
			<input
				type='text'
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder='Поиск категорий...'
				className='w-full rounded-md border border-border bg-input py-3 pl-12 pr-4 text-foreground duration-300 placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30'
				autoFocus
			/>
		</div>
	)
}
