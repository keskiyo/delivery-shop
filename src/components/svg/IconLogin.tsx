const IconLogin = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
	return (
		<svg
			xmlns={
				isLoggedIn
					? 'http://www.w3.org/2000/svg'
					: 'http://www.w3.org/2000/svg'
			}
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={`lucide ${isLoggedIn ? 'lucide-log-in-icon lucide-log-in' : 'lucide-log-out-icon lucide-log-out'}`}
		>
			{isLoggedIn ? (
				<>
					<path d='m16 17 5-5-5-5' />
					<path d='M21 12H9' />
					<path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
				</>
			) : (
				<>
					<path d='m10 17 5-5-5-5' />
					<path d='M15 12H3' />
					<path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' />
				</>
			)}
		</svg>
	)
}

export default IconLogin
