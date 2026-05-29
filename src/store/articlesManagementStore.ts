import type {
	Article,
	ArticleStatus,
	FilterType,
	SortDirection,
	SortField,
} from '@/app/(root)/(admin)/administrator/(cms)/cms/articles/articlesManagement/types'
import { create } from 'zustand'

interface LoadArticlesParams {
	page?: number
	search?: string
	filterType?: FilterType
}

interface ArticlesManagementStore {
	articles: Article[]
	totalItems: number
	totalPages: number
	totalAllItems: number
	loading: boolean
	isReordering: boolean
	currentPage: number
	itemsPerPage: number
	sortField: SortField
	sortDirection: SortDirection
	searchQuery: string
	filterType: FilterType
	draggedId: string | null
	dragOverId: string | null

	setArticles: (articles: Article[]) => void
	setIsReordering: (isReordering: boolean) => void
	setCurrentPage: (currentPage: number) => void
	setItemsPerPage: (itemsPerPage: number) => void
	setSortField: (sortField: SortField) => void
	setSortDirection: (sortDirection: SortDirection) => void
	setFilterType: (filterType: FilterType) => void
	handleSearchChange: (searchQuery: string) => void
	handleSearchClear: () => void
	setDraggedId: (draggedId: string | null) => void
	setDragOverId: (dragOverId: string | null) => void
	loadArticles: (params?: LoadArticlesParams) => Promise<void>
	updateArticleStatus: (id: string, status: ArticleStatus) => Promise<void>
	updateArticleFeatured: (id: string, isFeatured: boolean) => Promise<void>
}

export const useArticlesManagementStore = create<ArticlesManagementStore>(
	(set, get) => ({
		articles: [],
		totalItems: 0,
		totalPages: 0,
		totalAllItems: 0,
		loading: false,
		isReordering: false,
		currentPage: 1,
		itemsPerPage: 10,
		sortField: 'numericId',
		sortDirection: 'asc',
		searchQuery: '',
		filterType: 'all',
		draggedId: null,
		dragOverId: null,

		setArticles: articles => set({ articles }),
		setIsReordering: isReordering => set({ isReordering }),
		setCurrentPage: currentPage => set({ currentPage }),
		setItemsPerPage: itemsPerPage => set({ itemsPerPage }),
		setSortField: sortField => set({ sortField }),
		setSortDirection: sortDirection => set({ sortDirection }),
		setFilterType: filterType => set({ filterType }),
		handleSearchChange: searchQuery => set({ searchQuery }),
		handleSearchClear: () => set({ searchQuery: '' }),
		setDraggedId: draggedId => set({ draggedId }),
		setDragOverId: dragOverId => set({ dragOverId }),

		loadArticles: async params => {
			const state = get()
			set({ loading: true })

			try {
				const pageToLoad = params?.page ?? state.currentPage
				const search = params?.search ?? state.searchQuery
				const filterType = params?.filterType ?? state.filterType
				const queryParams = new URLSearchParams({
					pageToLoad: pageToLoad.toString(),
					limit: state.itemsPerPage.toString(),
					sortBy: state.sortField,
					sortOrder: state.sortDirection,
					search,
					filterBy: filterType,
				})

				const response = await fetch(
					`/administrator/cms/api/articles/articles-management?${queryParams}`,
				)
				const data = await response.json()

				if (data.success) {
					set({
						articles: data.data.articles,
						totalAllItems: data.data.totalInDB,
						totalItems: data.data.pagination.total,
						totalPages: data.data.pagination.totalPages,
						currentPage: pageToLoad,
						searchQuery: search,
						filterType,
					})
				}
			} finally {
				set({ loading: false })
			}
		},

		updateArticleStatus: async (id, status) => {
			const response = await fetch(
				'/administrator/cms/api/articles/articles-management/status',
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id, status }),
				},
			)

			if (!response.ok) {
				throw new Error('Не удалось обновить статус статьи')
			}

			set(state => ({
				articles: state.articles.map(article =>
					article._id.toString() === id ? { ...article, status } : article,
				),
			}))
		},

		updateArticleFeatured: async (id, isFeatured) => {
			const response = await fetch(
				'/administrator/cms/api/articles/articles-management/featured',
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id, isFeatured }),
				},
			)

			if (!response.ok) {
				throw new Error('Не удалось обновить избранность статьи')
			}

			set(state => ({
				articles: state.articles.map(article =>
					article._id.toString() === id
						? { ...article, isFeatured }
						: article,
				),
			}))
		},
	}),
)
