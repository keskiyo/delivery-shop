import { Search } from 'lucide-react'

const SearchInput = ({
	query,
	setQuery,
	handleSearch,
	handleInputFocus,
	handleInputBlur,
}: {
	query: string
	setQuery: (value: string) => void
	handleSearch: () => void
	handleInputFocus: () => void
	handleInputBlur: () => void
}) => {
	return (
		<div className='relative rounded border border-gray-300 leading-[150%]'>
			<form
				onSubmit={e => {
					e.preventDefault()
					handleSearch()
				}}
			>
				<input
					type='text'
					value={query}
					placeholder='Найти продукт'
					className='w-full h-10  p-2 outline-none bg-white text-base'
					onFocus={handleInputFocus}
					onChange={e => setQuery(e.target.value)}
					onBlur={handleInputBlur}
				/>
				<button
					className='absolute top-2 right-2 w-6 h-6 cursor-pointer'
					type='submit'
				>
					<Search size={24} />
				</button>
			</form>
		</div>
	)
}

export default SearchInput
