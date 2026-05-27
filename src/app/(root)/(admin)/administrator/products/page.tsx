import Link from 'next/link'

// 🔹 Типы для иконок и элементов меню
type IconName = 'plus' | 'list'

type MenuItem = {
	href: string
	title: string
	desc: string
	icon: IconName
}

// 🔹 Компонент иконки с типизацией
const Icon = ({ name }: { name: IconName }) => {
	const paths: Record<IconName, string> = {
		plus: 'M12 4v16m8-8H4',
		list: 'M4 6h16M4 12h16M4 18h16',
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

// 🔹 Данные меню
const menuItems: MenuItem[] = [
	{
		href: '/administrator/products/add-product',
		title: 'Добавление товара',
		desc: 'Создать новый товар и загрузить фото',
		icon: 'plus',
	},
	{
		href: '/administrator/products/products-list',
		title: 'Список товаров',
		desc: 'Управление каталогом, цены и наличие',
		icon: 'list',
	},
]

/**
 * Страница управления товарами
 */
const AdminProducts = () => {
	return (
		<div className='p-6 max-w-4xl mx-auto'>
			<div className='flex items-center justify-between mb-8'>
				<h1 className='text-3xl font-bold text-foreground'>Управление товарами</h1>

				{/* Кнопка "Назад" (опционально, для удобства навигации) */}
				<Link
					href='/administrator'
					className='text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1'
				>
					← Назад в панель
				</Link>
			</div>

			{/* Сетка карточек. 2 колонки идеально подходят для 2 элементов */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{menuItems.map(item => (
					<Link
						key={item.href}
						href={item.href}
						className='group relative flex flex-col items-start p-8 bg-card rounded-xl border border-border hover:border-brand hover:bg-surface-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
					>
						{/* Иконка */}
						<div className='p-4 bg-surface-subtle rounded-xl mb-5 text-muted-foreground group-hover:text-brand group-hover:bg-brand-soft transition-colors'>
							<Icon name={item.icon} />
						</div>

						{/* Текст */}
						<h3 className='text-xl font-semibold text-foreground mb-2 transition-colors'>
							{item.title}
						</h3>

						<p className='text-sm text-muted-foreground leading-relaxed'>
							{item.desc}
						</p>

						{/* Стрелочка */}
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

export default AdminProducts
