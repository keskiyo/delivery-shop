export interface ProductCardProps {
	_id: string
	id: number
	title: string
	img: string
	basePrice: number
	description: string
	discountPercent?: number
	rating: number
	weight?: string
	volume?: string
	categories: string[]
}
