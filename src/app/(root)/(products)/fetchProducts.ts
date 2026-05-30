const fetchProductsByTag = async (
	tag: string,
	options?: {
		pagination?: { startIdx: number; perPage: number }
		randomize?: boolean
	},
) => {
	try {
		const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`)
		url.searchParams.append('tag', tag)

		if (options?.pagination) {
			const { startIdx, perPage } = options.pagination
			url.searchParams.append('startIdx', startIdx.toString())
			url.searchParams.append('perPage', perPage.toString())
		}

		if (options?.randomize) {
			url.searchParams.append('random', 'true')
		}

		const res = await fetch(
			url.toString(),
			options?.randomize
				? { cache: 'no-store' }
				: { next: { revalidate: 3600 } },
		)

		if (!res.ok) {
			throw new Error(`Ошибка получения продуктов ${tag}`)
		}

		const data = await res.json()

		return {
			items: data.products || data,
			totalCount: data.totalCount || data.length,
		}
	} catch (err) {
		throw err
	}
}

export default fetchProductsByTag
