import { Heart, Menu, Package, ShoppingCart } from 'lucide-react'

const TopMenu = () => {
	return (
		<ul className='flex flex-row gap-x-6 items-end'>
			<li className='flex flex-col items-center gap-2.5 md:hidden w-11 cursor-pointer'>
				<Menu size={24} />
				<span>Каталог</span>
			</li>
			<li className='group flex flex-col items-center gap-2 w-11 cursor-pointer'>
				<Heart size={24} className=' group-hover:text-red-400' />
				<span>Избранное</span>
			</li>
			<li className='group flex flex-col items-center gap-2 w-11 cursor-pointer'>
				<Package size={24} className=' group-hover:text-blue-400' />
				<span>Заказы</span>
			</li>
			<li className='group flex flex-col items-center gap-2 w-11 cursor-pointer'>
				<ShoppingCart
					size={24}
					className=' group-hover:text-green-400'
				/>
				<span>Корзина</span>
			</li>
		</ul>
	)
}

export default TopMenu
