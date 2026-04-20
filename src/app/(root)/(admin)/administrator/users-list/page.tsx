'use client'

import Filters from '@/app/(root)/(admin)/administrator/users-list/_components/Filters'
import NavAndInfo from '@/app/(root)/(admin)/administrator/users-list/_components/NavAndInfo'
import UsersTable from '@/app/(root)/(admin)/administrator/users-list/_components/UsersTable'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { Loader } from '@/components/features/common/loader'
import { useAuthStore } from '@/store/authStore'
import { FiltersState } from '@/types/filterState'
import { UserData } from '@/types/userData'
import { useCallback, useEffect, useState } from 'react'
import { CONFIG } from '../../../../../../config/config'

const PAGE_SIZE_OPTIONS = [1, 5, 10, 20, 50, 100]

const initialFilters: FiltersState = {
	id: '',
	name: '',
	surname: '',
	email: '',
	phoneNumber: '',
	role: '',
	minAge: '',
	maxAge: '',
	startDate: '',
	endDate: '',
}

/**
 * Страница списка пользователей в админ-панели
 * 
 * Функционал:
 * - Отображение списка пользователей с пагинацией
 * - Фильтрация по ID, имени, фамилии, email, телефону, роли, возрасту, дате регистрации
 * - Сортировка по любому полю (asc/desc)
 * - Изменение количества элементов на странице
 * - Разграничение прав: менеджеры видят только пользователей своего региона/города
 * 
 * Логика работы:
 * 1. Загружает список пользователей с сервера с учетом фильтров и сортировки
 * 2. Для менеджеров автоматически применяется фильтр по региону и городу
 * 3. Фильтры применяются только после нажатия кнопки "Применить"
 * 4. При изменении страницы/сортировки/фильтров данные перезагружаются
 * 
 * @route /administrator/users-list
 */
const UsersList = () => {
	const [users, setUsers] = useState<UserData[]>([])
	const [pageSize, setPageSize] = useState(CONFIG.DEFAULT_PAGE_SIZE)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalUsers, setTotalUsers] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const [sortBy, setSortBy] = useState('createdAt')
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)
	const { user: currentUser } = useAuthStore()
	const isManager = currentUser?.role === 'manager'
	const [filters, setFilters] = useState<FiltersState>(initialFilters)
	const [appliedFilters, setAppliedFilters] =
		useState<FiltersState>(initialFilters)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize)
		setCurrentPage(1)
	}

	const handleSort = (field: string) => {
		const newDirection =
			sortBy === field && sortDirection === 'desc' ? 'asc' : 'desc'
		setSortBy(field)
		setSortDirection(newDirection)
		setCurrentPage(1)
	}

	const handleClearFilters = () => {
		setFilters(initialFilters)
		setAppliedFilters(initialFilters)
		setCurrentPage(1)
	}

	const handleFilterChange = (newFilters: FiltersState) => {
		setFilters(newFilters)
	}

	const handleApplyFilters = () => {
		setAppliedFilters(filters)
		setCurrentPage(1)
	}

	/**
	 * Загрузка списка пользователей с сервера
	 * 
	 * Формирует query параметры с учетом:
	 * - Пагинации (page, limit)
	 * - Сортировки (sortBy, sortDirection)
	 * - Фильтров (id, name, email, phone, role, age, dates)
	 * - Прав доступа (для менеджеров добавляется фильтр по региону/городу)
	 * 
	 * @param page - Номер страницы
	 * @param sortField - Поле для сортировки
	 * @param sortDir - Направление сортировки
	 * @param limit - Количество элементов на странице
	 * @param filters - Объект с фильтрами
	 */
	const loadUsers = useCallback(
		async (
			page: number,
			sortField: string,
			sortDir: 'asc' | 'desc',
			limit: number,
			filters: FiltersState,
		) => {
			try {
				setLoading(true)
				setError(null)

				const queryParams = new URLSearchParams({
					page: page.toString(),
					limit: limit.toString(),
					isManager: isManager.toString(),
					sortBy: sortField,
					sortDirection: sortDir,
				})

				if (filters.id) queryParams.append('id', filters.id)
				if (filters.name) queryParams.append('name', filters.name)
				if (filters.surname)
					queryParams.append('surname', filters.surname)
				if (filters.email) queryParams.append('email', filters.email)
				if (filters.phoneNumber)
					queryParams.append('phoneNumber', filters.phoneNumber)
				if (filters.role) queryParams.append('role', filters.role)
				if (filters.minAge) queryParams.append('minAge', filters.minAge)
				if (filters.maxAge) queryParams.append('maxAge', filters.maxAge)
				if (filters.startDate)
					queryParams.append('startDate', filters.startDate)
				if (filters.endDate)
					queryParams.append('endDate', filters.endDate)

				if (isManager && currentUser) {
					queryParams.append(
						'managerRegion',
						currentUser.region || '',
					)
					queryParams.append(
						'managerLocation',
						currentUser.location || '',
					)
				}

				const response = await fetch(`/api/admin/users?${queryParams}`)

				if (!response.ok) {
					throw new Error('Ошибка загрузки пользователей')
				}

				const data = await response.json()

				if (data?.users) {
					setUsers(data.users)
					setTotalUsers(data.totalCount)
					setTotalPages(data.totalPages)
				}
			} catch (error) {
				setError({
					error:
						error instanceof Error
							? error
							: new Error('Неизвестная ошибка'),
					userMessage: 'Не удалось загрузить список пользователей',
				})
			} finally {
				setLoading(false)
			}
		},
		[currentUser, isManager],
	)

	useEffect(() => {
		loadUsers(currentPage, sortBy, sortDirection, pageSize, appliedFilters)
	}, [
		loadUsers,
		currentPage,
		pageSize,
		sortBy,
		sortDirection,
		appliedFilters,
	])

	if (loading) return <Loader />

	if (error) {
		return (
			<ErrorComponent
				error={error.error}
				userMessage={error.userMessage}
			/>
		)
	}

	return (
		<div className='p-3 lg:p-6'>
			<NavAndInfo
				pageSize={pageSize}
				pageSizeOptions={PAGE_SIZE_OPTIONS}
				onPageSizeChange={handlePageSizeChange}
				totalUsers={totalUsers}
			/>
			<Filters
				onClearFilters={handleClearFilters}
				onFilterChange={handleFilterChange}
				onApplyFilters={handleApplyFilters}
				filters={filters}
			/>
			<UsersTable
				users={users}
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
				sortBy={sortBy}
				sortDirection={sortDirection}
				onSort={handleSort}
			/>
		</div>
	)
}

export default UsersList
