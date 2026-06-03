'use client'

import { buttonStyles } from '@/app/(root)/(auth)/styles'
import NumberInput from '@/components/ui/NumberInput'
import { FiltersState } from '@/types/filterState'

interface FiltersProps {
	filters: FiltersState
	onFilterChange: (filters: FiltersState) => void
	onClearFilters: () => void
	onApplyFilters: () => void
}

const Filters = ({
	filters,
	onFilterChange,
	onClearFilters,
	onApplyFilters,
}: FiltersProps) => {
	const handleInputChange = (field: keyof FiltersState, value: string) => {
		onFilterChange({
			...filters,
			[field]: value,
		})
	}

	const inputClasses =
		'w-full p-2 border border-border bg-card hover:bg-surface-hover rounded duration-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

	return (
		<div className='bg-card p-4 rounded-lg shadow-md border border-border'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-lg font-semibold'>Фильтры</h3>
				<div className='flex gap-2'>
					<button
						onClick={onApplyFilters}
						className={`${buttonStyles.active} [&&]:px-3 [&&]:text-xs`}
					>
						Найти
					</button>
					<button
						onClick={onClearFilters}
						className='px-3 py-2 text-xs justify-center text-text-soft items-center active:shadow-(--shadow-button-active) border-none rounded cursor-pointer transition-colors duration-300 bg-surface-hover hover:shadow-(--shadow-button-secondary)'
					>
						Очистить
					</button>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div>
					<label className='block text-xs font-medium mb-1'>ID</label>
					<input
						type='text'
						value={filters.id}
						onChange={e => handleInputChange('id', e.target.value)}
						placeholder='Поиск по ID'
						className={inputClasses}
					/>
				</div>

				<div>
					<label className='block text-xs font-medium mb-1'>
						Имя
					</label>
					<input
						type='text'
						value={filters.name}
						onChange={e =>
							handleInputChange('name', e.target.value)
						}
						placeholder='Поиск по имени'
						className={inputClasses}
					/>
				</div>

				<div>
					<label className='block text-xs font-medium mb-1'>
						Фамилия
					</label>
					<input
						type='text'
						value={filters.surname}
						onChange={e =>
							handleInputChange('surname', e.target.value)
						}
						placeholder='Поиск по фамилии'
						className={inputClasses}
					/>
				</div>

				<div>
					<label className='block text-xs font-medium mb-1'>
						Email
					</label>
					<input
						type='email'
						value={filters.email}
						onChange={e =>
							handleInputChange('email', e.target.value)
						}
						placeholder='Поиск по email'
						className={inputClasses}
					/>
				</div>

				<div>
					<label className='block text-xs font-medium mb-1'>
						Телефон
					</label>
					<input
						type='tel'
						value={filters.phoneNumber}
						onChange={e =>
							handleInputChange('phoneNumber', e.target.value)
						}
						placeholder='Поиск по телефону'
						className={inputClasses}
					/>
				</div>

				<div>
					<label className='block text-xs font-medium mb-1'>
						Роль
					</label>
					<select
						value={filters.role}
						onChange={e =>
							handleInputChange('role', e.target.value)
						}
						className={inputClasses}
					>
						<option value=''>Все роли</option>
						<option value='user'>Пользователь</option>
						<option value='manager'>Менеджер</option>
					</select>
				</div>

				<div>
					<label className='block text-xs font-medium mb-1'>
						Возраст от
					</label>
					<NumberInput
						value={filters.minAge}
						onChange={e =>
							handleInputChange('minAge', e.target.value)
						}
						min='0'
						placeholder='От'
						className={inputClasses}
					/>
				</div>

				<div>
					<label className='block text-xs font-medium mb-1'>
						Возраст до
					</label>
					<NumberInput
						value={filters.maxAge}
						onChange={e =>
							handleInputChange('maxAge', e.target.value)
						}
						min='0'
						placeholder='До'
						className={inputClasses}
					/>
				</div>

				<div>
					<label className='block text-xs font-medium mb-1'>
						Регистрация от
					</label>
					<input
						type='date'
						value={filters.startDate}
						onChange={e =>
							handleInputChange('startDate', e.target.value)
						}
						className={inputClasses}
					/>
				</div>

				<div>
					<label className='block text-xs font-medium mb-1'>
						Регистрация до
					</label>
					<input
						type='date'
						value={filters.endDate}
						onChange={e =>
							handleInputChange('endDate', e.target.value)
						}
						className={inputClasses}
					/>
				</div>
			</div>
		</div>
	)
}

export default Filters
