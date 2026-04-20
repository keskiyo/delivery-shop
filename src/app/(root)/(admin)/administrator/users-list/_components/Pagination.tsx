import { ArrowLeft, ArrowRight } from 'lucide-react'

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}) => {
	if (totalPages <= 1) return null

	const getVisiblePages = () => {
		const maxVisible = 5
		const pages = []

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			let start = Math.max(1, currentPage - 2)
			const end = Math.min(totalPages, start + maxVisible - 1)

			if (end - start + 1 < maxVisible) {
				start = end - maxVisible + 1
			}

			for (let i = start; i <= end; i++) {
				pages.push(i)
			}
		}

		return pages
	}

	return (
		<div className='flex justify-center items-center mt-12 p-4 border-t border-gray-300'>
			<div className='flex gap-2'>
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className='px-3 py-1 disabled:opacity-50 hover:text-[#ff6633] duration-300 cursor-pointer disabled:cursor-not-allowed'
				>
					<ArrowLeft size={24} />
				</button>

				{getVisiblePages().map(page => (
					<button
						key={page}
						onClick={() => onPageChange(page)}
						className={`w-5 h-5 md:w-10 md:h-10 flex items-center justify-center rounded duration-300 cursor-pointer ${
							currentPage === page
								? 'text-[#ff6633] border-2 border-[#ff6633]'
								: 'hover:bg-[#ff6633] light:hover:text-white'
						}`}
					>
						{page}
					</button>
				))}

				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className='px-3 py-1 disabled:opacity-50 hover:text-[#ff6633] cursor-pointer disabled:cursor-not-allowed'
				>
					<ArrowRight size={24} />
				</button>
			</div>
		</div>
	)
}

export default Pagination
