import CatalogPage from '@/app/(root)/(catalog)/CatalogPage'

export const metadata = {
	title: 'Каталог товаров магазина "Фудмаркет"',
	description: 'Каталог всех товаров магазина "Фудмаркет"',
}

/**
 * Страница каталога товаров
 * 
 * Отображает все категории товаров магазина в виде сетки карточек
 * Каждая карточка ведет на страницу категории с товарами
 * 
 * @route /catalog
 */
export default function Catalog() {
	return <CatalogPage />
}
