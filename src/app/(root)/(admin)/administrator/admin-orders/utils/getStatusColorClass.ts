// Назначение: утилита getStatusColorClass.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const getStatusColorClass = (
	statusLabel: string,
	isSelected: boolean = false,
): string => {
	switch (statusLabel) {
		case 'Новый':
			return isSelected
				? 'bg-muted text-foreground'
				: 'text-muted-foreground hover:bg-muted'
		case 'Собран':
			return isSelected
				? 'bg-brand text-white'
				: 'text-brand hover:bg-brand-soft'
		case 'Доставляется':
			return isSelected
				? 'bg-sky-500 text-white'
				: 'text-sky-500 dark:text-sky-300 hover:bg-sky-500/10'
		case 'Подтвержден':
			return isSelected
				? 'bg-success text-white'
				: 'text-success hover:bg-success-soft'
		case 'Не подтвердили':
			return isSelected
				? 'bg-warning text-white'
				: 'text-warning hover:bg-warning-soft'
		case 'Возврат':
			return isSelected
				? 'bg-danger text-white'
				: 'text-danger hover:bg-danger-soft'
		case 'Вернули':
			return isSelected
				? 'bg-purple-500 text-white'
				: 'text-purple-500 dark:text-purple-300 hover:bg-purple-500/10'
		default:
			return isSelected
				? 'bg-surface-hover text-foreground'
				: 'text-foreground hover:bg-surface-hover'
	}
}

export const getStatusIconColorClass = (statusLabel: string): string => {
	switch (statusLabel) {
		case 'Новый':
			return 'bg-muted text-foreground'
		case 'Собран':
			return 'bg-brand text-white'
		case 'Доставляется':
			return 'bg-sky-500 text-white'
		case 'Подтвержден':
			return 'bg-success text-white'
		case 'Не подтвердили':
			return 'bg-warning text-white'
		case 'Возврат':
			return 'bg-danger text-white'
		case 'Вернули':
			return 'bg-purple-500 text-white'
		default:
			return 'bg-surface-hover text-foreground'
	}
}
