'use client'

import { ItemsPerPageSelector } from '@/app/(root)/(admin)/administrator/_components/ItemPerPageSelector'
import { useConfirm } from '@/components/ui/confirm/ConfirmProvider'
import { useCardsStore } from '@/store/useCardsStore'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Pagination } from '../_components/Pagination'
import { AddCardForm } from './_components/AddCardForm'
import { CardTable } from './_components/CardTable'
import { FilterBar } from './_components/FilterBar'
import { Card } from './types/cards.types'

const CardsPage = () => {
	const confirmDialog = useConfirm()
	const {
		cards,
		totalPages,
		loading,
		currentPage,
		currentFilter,
		searchCardNumber,
		searchOwner,
		itemsPerPage,
		setCurrentFilter,
		setSearchCardNumber,
		setSearchOwner,
		setCurrentPage,
		setItemsPerPage,
		loadCards,
	} = useCardsStore()

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const [tempSearchCardNumber, setTempSearchCardNumber] =
		useState(searchCardNumber)
	const [tempSearchOwner, setTempSearchOwner] = useState(searchOwner)
	const [tempFilter, setTempFilter] = useState(currentFilter)

	useEffect(() => {
		loadCards({
			filter: currentFilter,
			searchCardNumber,
			searchOwner,
			page: currentPage,
			limit: itemsPerPage,
		})
	}, [
		currentPage,
		currentFilter,
		searchCardNumber,
		searchOwner,
		itemsPerPage,
		loadCards,
	])

	const handleApplyFilters = () => {
		setCurrentFilter(tempFilter)
		setSearchCardNumber(tempSearchCardNumber)
		setSearchOwner(tempSearchOwner)
		setCurrentPage(1)
	}

	const handleResetFilters = () => {
		setTempFilter('all')
		setTempSearchCardNumber('')
		setTempSearchOwner('')
		setCurrentFilter('all')
		setSearchCardNumber('')
		setSearchOwner('')
		setCurrentPage(1)
	}

	const handleItemsPerPageChange = (newLimit: number) => {
		setItemsPerPage(newLimit)
		setCurrentPage(1)
	}

	const handleAddCard = async (cleanedCardNumber: string) => {
		setIsSubmitting(true)
		setError('')
		setSuccess('')

		try {
			const response = await fetch('/api/admin/cards', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ cardNumber: cleanedCardNumber }),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Ошибка при добавлении карты')
			}

			setSuccess(data.message)
			toast.success(data.message || 'Карта добавлена')
			loadCards({
				filter: currentFilter,
				searchCardNumber,
				searchOwner,
				page: currentPage,
				limit: itemsPerPage,
			})
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message)
				toast.error(err.message)
			} else {
				const message = 'Произошла неизвестная ошибка'
				setError(message)
				toast.error(message)
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleToggleActive = async (card: Card) => {
		const action = card.isActive ? 'deactivate' : 'activate'
		const message = card.isActive
			? 'Деактивировать карту? Она станет недоступна для использования.'
			: 'Активировать карту? Она станет доступна для использования.'

		const confirmed = await confirmDialog({
			title: card.isActive ? 'Деактивировать карту' : 'Активировать карту',
			description: message,
			confirmText: card.isActive ? 'Деактивировать' : 'Активировать',
			variant: card.isActive ? 'warning' : 'success',
		})

		if (!confirmed) return

		try {
			const response = await fetch(
				`/api/admin/cards?cardNumber=${card.cardNumber}&action=${action}`,
				{ method: 'PATCH' },
			)

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Ошибка при изменении статуса')
			}

			toast.success(
				data.message ||
					(card.isActive
						? 'Карта деактивирована'
						: 'Карта активирована'),
			)
			loadCards({
				filter: currentFilter,
				searchCardNumber,
				searchOwner,
				page: currentPage,
				limit: itemsPerPage,
			})
		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message)
			} else {
				toast.error('Не удалось изменить статус карты')
			}
		}
	}

	const handleDelete = async (card: Card) => {
		const warning = card.owner
			? 'Карта привязана к пользователю! Удалить всё равно? Это действие необратимо.'
			: 'Удалить карту из системы? Это действие необратимо.'

		const confirmed = await confirmDialog({
			title: 'Удалить карту',
			description: warning,
			confirmText: 'Удалить',
			variant: 'danger',
		})

		if (!confirmed) return

		try {
			const response = await fetch(
				`/api/admin/cards?cardNumber=${card.cardNumber}`,
				{
					method: 'DELETE',
				},
			)

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Ошибка при удалении карты')
			}

			toast.success(data.message || 'Карта удалена')
			loadCards({
				filter: currentFilter,
				searchCardNumber,
				searchOwner,
				page: currentPage,
				limit: itemsPerPage,
			})
		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message)
			} else {
				toast.error('Не удалось удалить карту')
			}
		}
	}

	return (
		<div className='container p-6 mx-auto'>
			<h1 className='mb-6 text-2xl font-bold'>
				Управление картами лояльности
			</h1>

			<AddCardForm
				onSubmit={handleAddCard}
				isSubmitting={isSubmitting}
				error={error}
				success={success}
				onErrorChange={setError}
				onSuccessChange={setSuccess}
			/>

			<div className='p-6 bg-card rounded-lg shadow'>
				<FilterBar
					tempFilter={tempFilter}
					tempSearchCardNumber={tempSearchCardNumber}
					tempSearchOwner={tempSearchOwner}
					onTempFilterChange={setTempFilter}
					onTempSearchCardNumberChange={setTempSearchCardNumber}
					onTempSearchOwnerChange={setTempSearchOwner}
					onApplyFilters={handleApplyFilters}
					onResetFilters={handleResetFilters}
				/>

				<ItemsPerPageSelector
					value={itemsPerPage}
					onChange={handleItemsPerPageChange}
				/>

				{loading ? (
					<p className='text-muted-foreground'>Загрузка...</p>
				) : cards.length === 0 ? (
					<p className='text-muted-foreground'>Карты не найдены</p>
				) : (
					<>
						<CardTable
							cards={cards}
							onToggleActive={handleToggleActive}
							onDelete={handleDelete}
						/>
						{totalPages > 1 && <Pagination type='cards' />}
					</>
				)}
			</div>
		</div>
	)
}

export default CardsPage
