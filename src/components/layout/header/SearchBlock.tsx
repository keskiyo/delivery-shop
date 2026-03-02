import InputBlock from '@/components/layout/header/inputSearch/InputBlock'
import { Menu } from 'lucide-react'
import Link from 'next/link'

const SearchBlock = ({
	onFocusChangeAction,
}: {
	onFocusChangeAction: (focused: boolean) => void
}) => {
	return (
		<div className='flex flex-row gap-4 items-center grow text-gray-300'>
			<Link
				href='/catalog'
				className='hidden md:flex w-auto min-w-18 px-3 py-2 gap-2 items-center shrink-0 rounded hover:text-white transition-colors cursor-pointer bg-orange-500 hover:bg-orange-400'
			>
				<Menu size={24} />
				<span className='text-base hidden lg:block'>Каталог</span>
			</Link>

			<InputBlock onFocusChangeAction={onFocusChangeAction} />
		</div>
	)
}

export default SearchBlock
