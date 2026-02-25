const fetchPurchases = async (options?: {
	usersPurchasesLimit?: number
	pagination?: { startIdx: number; perPage: number }
}) => {
	try {
		const url = new URL(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/purchases`,
		)

		if (options?.usersPurchasesLimit) {
			url.searchParams.append(
				'usersPurchasesLimit',
				options.usersPurchasesLimit.toString(),
			)
		} else if (options?.pagination) {
			const { startIdx, perPage } = options.pagination
			url.searchParams.append('startIdx', startIdx.toString())
			url.searchParams.append('perPage', perPage.toString())
		}

		const res = await fetch(url.toString(), { next: { revalidate: 3600 } })

		if (!res.ok) {
			throw new Error('Ошибка получения прошлых покупок')
		}

		const data = await res.json()

		return {
			items: data.products || data,
			totalCount: data.totalCount || data.length,
		}
	} catch (err) {
		console.error('Ошибка получения покупок', err)
		throw err
	}
}

export default fetchPurchases
