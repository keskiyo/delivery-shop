import Link from 'next/link'

type IconName = 'users' | 'plus' | 'list' | 'truck' | 'cart' | 'settings'

type MenuItem = {
	href: string
	title: string
	desc: string
	icon: IconName
}


const Icon = ({ name }: { name: IconName }) => {
	const paths: Record<IconName, string> = {
		users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
		plus: 'M12 4v16m8-8H4',
		list: 'M4 6h16M4 12h16M4 18h16',
		truck: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14M19 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
		cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
		settings:
			'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
	}

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-6 w-6'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d={paths[name]}
			/>
		</svg>
	)
}


const menuItems: MenuItem[] = [
	{
		href: '/administrator/users-list',
		title: 'Управление пользователями',
		desc: 'Список, роли и доступы',
		icon: 'users',
	},
	{
		href: '/administrator/products/add-product',
		title: 'Добавление товара',
		desc: 'Создать новый товар',
		icon: 'plus',
	},
	{
		href: '/administrator/products/products-list',
		title: 'Список товаров',
		desc: 'Редактирование каталога',
		icon: 'list',
	},
	{
		href: '/administrator/delivery-times',
		title: 'График доставки',
		desc: 'Расписание слотов',
		icon: 'truck',
	},
	{
		href: '/administrator/admin-orders',
		title: 'Заказы пользователей',
		desc: 'Статусы и история',
		icon: 'cart',
	},
	{
		href: '/administrator/cms',
		title: 'Система управления (CMS)',
		desc: 'Настройки контента',
		icon: 'settings',
	},
]


const AdminPanel = () => {
	return (
		<div className='p-6 max-w-7xl mx-auto'>
			<h1 className='text-3xl font-bold mb-8 text-foreground'>Панель управления</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{menuItems.map(item => (
					<Link
						key={item.href}
						href={item.href}
						className='group relative flex flex-col items-start p-6 bg-card rounded-xl border border-border hover:border-brand hover:bg-surface-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
					>
						<div className='p-3 bg-surface-subtle rounded-lg mb-4 text-muted-foreground group-hover:text-brand group-hover:bg-brand-soft transition-colors'>
							<Icon name={item.icon} />
						</div>

						<h3 className='text-xl font-semibold text-foreground mb-2 transition-colors'>
							{item.title}
						</h3>

						<p className='text-sm text-muted-foreground'>
							{item.desc}
						</p>

						<div className='absolute top-6 right-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
									clipRule='evenodd'
								/>
							</svg>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}

export default AdminPanel
