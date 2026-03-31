import Pagination from '@/app/(root)/(admin)/administrator/users-list/_components/Pagination'
import TableHeader from '@/app/(root)/(admin)/administrator/users-list/_components/TableHeader'
import TableRow from '@/app/(root)/(admin)/administrator/users-list/_components/TableRow'
import { UserData } from '@/types/userData'

interface UsersTableProps {
	users: UserData[]
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
	sortBy: string
	sortDirection: 'asc' | 'desc'
	onSort: (field: string, direction: 'asc' | 'desc') => void
}

const UsersTable = ({
	users,
	currentPage,
	totalPages,
	onPageChange,
	sortBy,
	sortDirection,
	onSort,
}: UsersTableProps) => {
	return (
		<div className='bg-card rounded shadow-lg border border-gray-200 overflow-hidden mt-4'>
			<TableHeader
				sortBy={sortBy}
				sortDirection={sortDirection}
				onSort={onSort}
			/>
			<div className='divide-y divide-gray-200 flex flex-col gap-y-5 border-b border-gray-200 pb-3'>
				{users.map(user => (
					<TableRow key={user.id} user={user} />
				))}
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</div>
	)
}

export default UsersTable
