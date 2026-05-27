export const getStatusColorClass = (
	statusLabel: string,
	isSelected: boolean = false,
): string => {
	switch (statusLabel) {
		case 'Новый':
		case 'Доставляется':
			return isSelected ? 'bg-surface-hover text-foreground' : 'text-foreground'
		case 'Собран':
			return isSelected ? 'bg-success text-white' : 'text-success'
		case 'Подтвержден':
			return isSelected ? 'bg-success text-white' : 'text-success'
		case 'Не подтвердили':
			return isSelected ? 'bg-warning text-white' : 'text-warning'
		case 'Возврат':
			return isSelected ? 'bg-danger text-white' : 'text-danger'
		case 'Вернули':
			return isSelected ? 'bg-brand text-white' : 'text-brand'
		default:
			return isSelected ? 'bg-surface-hover text-foreground' : 'text-foreground'
	}
}
