import { HeaderProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types/dashboard'

export const Header = ({ title, description }: HeaderProps) => {
	return (
		<header className='mb-8'>
			<h1 className='text-2xl md:text-3xl font-bold'>{title}</h1>
			<p className='mt-2 text-muted-foreground'>{description}</p>
		</header>
	)
}
