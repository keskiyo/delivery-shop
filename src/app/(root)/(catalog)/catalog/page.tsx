import CatalogPage from '@/app/(root)/(catalog)/CatalogPage'
import { baseUrl } from '../../../../../utils/baseUrl'

const canonicalUrl = `${baseUrl}/catalog`

export const metadata = {
	metadataBase: new URL(baseUrl),
	title: 'Каталог товаров магазина "Фудмаркета"',
	description: 'Каталог всех товаров магазина "Фудмаркета"',
	alternates: {
		canonical: canonicalUrl,
	},
	keywords: ['каталог', 'товары', 'Фудмаркета'],
	openGraph: {
		title: 'Каталог товаров магазина "Фудмаркета"',
		description: 'Каталог всех товаров магазина "Фудмаркета"',
		url: canonicalUrl,
		images: '/og-images/catalog-og.jpg',
	},
}

export default function Catalog() {
	return <CatalogPage />
}
