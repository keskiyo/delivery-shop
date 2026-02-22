import { ProductCardProps } from '@/types/product'

export interface ProductsSectionsProps {
	title: string
	viewAllLink?: {
		text: string
		href: string
	}
	products: ProductCardProps[]
	compact?: boolean
}
