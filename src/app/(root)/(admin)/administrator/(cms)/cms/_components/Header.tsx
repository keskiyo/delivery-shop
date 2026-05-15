interface HeaderProps {
	title: string
	description?: string
}

const Header = ({ title, description }: HeaderProps) => {
	return (
		<header className='mb-8'>
			<h1 className='text-2xl md:text-3xl font-bold'>{title}</h1>
			<p className='mt-2'>{description}</p>
		</header>
	)
}

export default Header
